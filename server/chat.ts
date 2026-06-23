import { WebSocketServer, WebSocket } from 'ws';
import type { Server } from 'http';
import { pool } from './db/pool.js';

interface ChatClient {
  socket: WebSocket;
  conversationId: string;
  senderType: 'renter' | 'agent';
}

const clients = new Set<ChatClient>();

type IncomingMessage =
  | { type: 'join'; conversationId: string; senderType: 'renter' | 'agent' }
  | { type: 'message'; conversationId: string; senderType: 'renter' | 'agent'; body: string }
  | { type: 'read'; conversationId: string; senderType: 'renter' | 'agent' };

/* ─────────────────────────────────────────────────────────────
   SAFETY FILTERING
   ─────────────────────────────────────────────────────────────
   Two layers:
   1. Phone-number-like patterns — blocked outright, no legitimate
      reason a chat message needs a string of 7+ digits.
   2. Platform-switching phrases — flagged with a warning sent
      back to the sender rather than silently blocked, since these
      can have false positives ("call me crazy but...") and silent
      blocking just confuses users without teaching them why.
───────────────────────────────────────────────────────────── */

// Matches sequences that look like phone numbers: optional +, then
// 7+ digits possibly separated by spaces/dashes/dots/parens.
const PHONE_PATTERN = /(\+?\d[\d\s\-.()]{6,}\d)/;

// Catches digits written as words too (e.g. "zero eight zero six...")
const SPELLED_DIGIT_PATTERN = /\b(zero|one|two|three|four|five|six|seven|eight|nine)\b(?:\s+\b(zero|one|two|three|four|five|six|seven|eight|nine)\b){5,}/i;

const PLATFORM_SWITCH_PHRASES = [
  /whats\s*app/i,
  /\bwa\.me\b/i,
  /call me/i,
  /text me/i,
  /\bsms\b/i,
  /reach me (on|at)/i,
  /my number is/i,
  /contact me (on|at|outside)/i,
  /chat (elsewhere|outside|off)/i,
  /move (this|the chat|off)/i,
  /off[\s-]?platform/i,
  /\btelegram\b/i,
  /\binstagram\b/i,
  /\bfacebook\b/i,
  /pay (me )?directly/i,
  /bank transfer (to|details)/i,
  /send (cash|money) (to|directly)/i,
  /outside (the )?app/i,
  /outside (the )?platform/i,
  /send (me )?(money|cash|funds)/i,
  /transfer (it|the money|funds)/i,
  /\bacct\b/i,
  /first\s*bank|gtbank|access\s*bank|zenith|uba\b|opay|moniepoint|kuda/i,
  /\bnaira\b.*\b(send|transfer|pay)\b/i,
  /pay\s*(upfront|in advance)/i,
];

function containsPhoneNumber(text: string): boolean {
  return PHONE_PATTERN.test(text) || SPELLED_DIGIT_PATTERN.test(text);
}

function containsPlatformSwitchPhrase(text: string): boolean {
  return PLATFORM_SWITCH_PHRASES.some(pattern => pattern.test(text));
}

export function attachChatServer(httpServer: Server) {
  const wss = new WebSocketServer({ server: httpServer, path: '/ws/chat' });

  wss.on('connection', (socket: WebSocket) => {
    let client: ChatClient | null = null;

    socket.on('message', async (raw) => {
      let msg: IncomingMessage;
      try {
        msg = JSON.parse(raw.toString());
      } catch {
        socket.send(JSON.stringify({ type: 'error', message: 'Invalid message format.' }));
        return;
      }

      if (msg.type === 'join') {
        const convo = await pool.query('SELECT id FROM conversations WHERE id = $1', [msg.conversationId]);
        if (convo.rowCount === 0) {
          socket.send(JSON.stringify({ type: 'error', message: 'Conversation not found.' }));
          return;
        }

        client = { socket, conversationId: msg.conversationId, senderType: msg.senderType };
        clients.add(client);

        const history = await pool.query(
          `SELECT id, sender_type, body, read_at, created_at
           FROM messages WHERE conversation_id = $1
           ORDER BY created_at ASC`,
          [msg.conversationId]
        );
        socket.send(JSON.stringify({ type: 'history', messages: history.rows }));
        return;
      }

      if (!client) {
        socket.send(JSON.stringify({ type: 'error', message: 'Join a conversation before sending messages.' }));
        return;
      }

      if (msg.type === 'message') {
        const body = msg.body?.trim();
        if (!body) return;

        // ── SAFETY: block phone numbers outright ──
        if (containsPhoneNumber(body)) {
          socket.send(JSON.stringify({
            type: 'blocked',
            reason: 'phone_number',
            message: 'For your safety, phone numbers and contact details can\'t be shared in chat. Keep all communication on NestHaven.',
          }));
          return;
        }

        // ── SAFETY: flag platform-switching language, warn but allow ──
        const flagged = containsPlatformSwitchPhrase(body);

        const result = await pool.query(
          `INSERT INTO messages (conversation_id, sender_type, body)
           VALUES ($1, $2, $3)
           RETURNING id, sender_type, body, read_at, created_at`,
          [client.conversationId, client.senderType, body]
        );

        await pool.query(
          `UPDATE conversations SET updated_at = now() WHERE id = $1`,
          [client.conversationId]
        );

        const payload = JSON.stringify({ type: 'message', message: result.rows[0] });

        for (const c of clients) {
          if (c.conversationId === client.conversationId && c.socket.readyState === WebSocket.OPEN) {
            c.socket.send(payload);
          }
        }

        // Broadcast the safety warning to EVERYONE in the conversation room
        // (both agent and renter), not just the sender — both sides should
        // see a message was flagged, tagged with the message ID so each
        // side's UI can render it inline under that specific message.
        if (flagged) {
          const warningPayload = JSON.stringify({
            type: 'safety_warning',
            messageId: result.rows[0].id,
            message: 'This message was flagged. Keep all communication and payments on NestHaven. If someone asks you to move off-platform, please report them.',
          });
          for (const c of clients) {
            if (c.conversationId === client.conversationId && c.socket.readyState === WebSocket.OPEN) {
              c.socket.send(warningPayload);
            }
          }
        }
        return;
      }

      if (msg.type === 'read') {
        await pool.query(
          `UPDATE messages SET read_at = now()
           WHERE conversation_id = $1 AND sender_type != $2 AND read_at IS NULL`,
          [client.conversationId, client.senderType]
        );

        const payload = JSON.stringify({ type: 'read_receipt', byType: client.senderType });
        for (const c of clients) {
          if (c.conversationId === client.conversationId && c.socket.readyState === WebSocket.OPEN) {
            c.socket.send(payload);
          }
        }
        return;
      }
    });

    socket.on('close', () => {
      if (client) clients.delete(client);
    });

    socket.on('error', () => {
      if (client) clients.delete(client);
    });
  });

  console.log('✅ WebSocket chat server attached at /ws/chat (with safety filtering)');
  return wss;
}
