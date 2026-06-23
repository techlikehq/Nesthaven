import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import dotenv from 'dotenv';
import { pool } from './db/pool.js';
import { attachChatServer } from './chat.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;

app.post('/api/conversations', async (req, res) => {
  const { propertyId, agentId, renterName, renterPhone, renterEmail } = req.body;

  if (!agentId || !renterName || !renterPhone) {
    return res.status(400).json({ error: 'agentId, renterName, and renterPhone are required.' });
  }

  try {
    const existing = await pool.query(
      `SELECT id FROM conversations
       WHERE agent_id = $1 AND renter_phone = $2
         AND (property_id = $3 OR ($3 IS NULL AND property_id IS NULL))
       LIMIT 1`,
      [agentId, renterPhone, propertyId ?? null]
    );

    if (existing.rowCount && existing.rowCount > 0) {
      return res.json({ conversationId: existing.rows[0].id, resumed: true });
    }

    const result = await pool.query(
      `INSERT INTO conversations (property_id, agent_id, renter_name, renter_phone, renter_email)
       VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      [propertyId ?? null, agentId, renterName, renterPhone, renterEmail ?? null]
    );

    res.json({ conversationId: result.rows[0].id, resumed: false });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create conversation.' });
  }
});

// SECURITY: renter_phone deliberately excluded from this response.
// Agents see who they're talking to by name only — never raw contact info.
app.get('/api/conversations/agent/:agentId', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT c.id, c.property_id, c.status, c.created_at, c.updated_at,
        c.renter_name,
        p.title AS property_title,
        (SELECT body FROM messages WHERE conversation_id = c.id ORDER BY created_at DESC LIMIT 1) AS last_message,
        (SELECT COUNT(*) FROM messages WHERE conversation_id = c.id AND sender_type = 'renter' AND read_at IS NULL) AS unread_count
       FROM conversations c
       LEFT JOIN properties p ON p.id = c.property_id
       WHERE c.agent_id = $1
       ORDER BY c.updated_at DESC`,
      [req.params.agentId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch conversations.' });
  }
});

// SECURITY: renters never see agent phone numbers either — name/photo only.
app.get('/api/conversations/renter/:phone', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT c.id, c.property_id, c.status, c.created_at, c.updated_at,
        p.title AS property_title, a.name AS agent_name, a.photo_url AS agent_photo, a.verified AS agent_verified,
        (SELECT body FROM messages WHERE conversation_id = c.id ORDER BY created_at DESC LIMIT 1) AS last_message,
        (SELECT COUNT(*) FROM messages WHERE conversation_id = c.id AND sender_type = 'agent' AND read_at IS NULL) AS unread_count
       FROM conversations c
       LEFT JOIN properties p ON p.id = c.property_id
       LEFT JOIN agents a ON a.id = c.agent_id
       WHERE c.renter_phone = $1
       ORDER BY c.updated_at DESC`,
      [req.params.phone]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch conversations.' });
  }
});

app.patch('/api/conversations/:id/status', async (req, res) => {
  const { status } = req.body;
  if (!['active', 'closed', 'disputed'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status.' });
  }
  try {
    await pool.query('UPDATE conversations SET status = $1, updated_at = now() WHERE id = $2', [status, req.params.id]);
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update status.' });
  }
});

// New: reports
app.post('/api/reports', async (req, res) => {
  const { conversationId, reportedBy, reason, details } = req.body;
  if (!conversationId || !reportedBy || !reason) {
    return res.status(400).json({ error: 'conversationId, reportedBy, and reason are required.' });
  }
  try {
    await pool.query(
      `INSERT INTO reports (conversation_id, reported_by, reason, details) VALUES ($1, $2, $3, $4)`,
      [conversationId, reportedBy, reason, details ?? null]
    );
    await pool.query(`UPDATE conversations SET status = 'disputed', updated_at = now() WHERE id = $1`, [conversationId]);
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to submit report.' });
  }
});

// ── Admin stats endpoint — real data for the dashboard ──
app.get('/api/admin/stats', requireAdmin, async (req, res) => {
  try {
    const [
      properties, agents, conversations, messages, reports,
      propsByType, propsByListing, propsByNeighbourhood,
      recentConvos, agentPerformance, reportsByReason
    ] = await Promise.all([
      pool.query('SELECT COUNT(*) FROM properties'),
      pool.query('SELECT COUNT(*) FROM agents WHERE verified = true'),
      pool.query('SELECT COUNT(*) FROM conversations'),
      pool.query('SELECT COUNT(*) FROM messages'),
      pool.query("SELECT COUNT(*) FROM reports WHERE status = 'open'"),
      pool.query('SELECT property_type, COUNT(*) as count FROM properties GROUP BY property_type ORDER BY count DESC'),
      pool.query('SELECT listing_type, COUNT(*) as count FROM properties GROUP BY listing_type ORDER BY count DESC'),
      pool.query(`SELECT n.name, COUNT(p.id) as count FROM neighbourhoods n LEFT JOIN properties p ON p.neighbourhood_id = n.id WHERE n.city = 'Port Harcourt' GROUP BY n.name ORDER BY count DESC LIMIT 6`),
      pool.query(`SELECT c.id, c.renter_name, c.status, c.created_at, a.name as agent_name, p.title as property_title FROM conversations c JOIN agents a ON a.id = c.agent_id LEFT JOIN properties p ON p.id = c.property_id ORDER BY c.created_at DESC LIMIT 5`),
      pool.query(`SELECT a.id, a.name, a.agency, a.rating, a.deals_count, a.verified, a.photo_url, COUNT(c.id) as conversations FROM agents a LEFT JOIN conversations c ON c.agent_id = a.id GROUP BY a.id ORDER BY a.deals_count DESC`),
      pool.query('SELECT reason, COUNT(*) as count FROM reports GROUP BY reason ORDER BY count DESC'),
    ]);

    res.json({
      stats: {
        totalProperties: parseInt(properties.rows[0].count),
        verifiedAgents: parseInt(agents.rows[0].count),
        totalConversations: parseInt(conversations.rows[0].count),
        totalMessages: parseInt(messages.rows[0].count),
        openReports: parseInt(reports.rows[0].count),
      },
      propsByType: propsByType.rows,
      propsByListing: propsByListing.rows,
      propsByNeighbourhood: propsByNeighbourhood.rows,
      recentConversations: recentConvos.rows,
      agentPerformance: agentPerformance.rows,
      reportsByReason: reportsByReason.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch stats.' });
  }
});

// ── Admin auth middleware ──
function requireAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
  const key = req.headers['x-admin-key'];
  if (!key || key !== process.env.ADMIN_API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}

// List all reports with full context
app.get('/api/admin/reports', requireAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
        r.id, r.conversation_id, r.reported_by, r.reason, r.details, r.status, r.created_at,
        c.renter_name, c.status AS conversation_status,
        a.name AS agent_name, a.agency AS agent_agency,
        p.title AS property_title
       FROM reports r
       JOIN conversations c ON c.id = r.conversation_id
       JOIN agents a ON a.id = c.agent_id
       LEFT JOIN properties p ON p.id = c.property_id
       ORDER BY r.created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch reports.' });
  }
});

// Get full conversation messages for a report's context
app.get('/api/admin/reports/:id/messages', requireAdmin, async (req, res) => {
  try {
    const report = await pool.query('SELECT conversation_id FROM reports WHERE id = $1', [req.params.id]);
    if (report.rowCount === 0) return res.status(404).json({ error: 'Report not found.' });

    const messages = await pool.query(
      `SELECT id, sender_type, body, created_at FROM messages
       WHERE conversation_id = $1 ORDER BY created_at ASC`,
      [report.rows[0].conversation_id]
    );
    res.json(messages.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch messages.' });
  }
});

// Update report status
app.patch('/api/admin/reports/:id', requireAdmin, async (req, res) => {
  const { status } = req.body;
  if (!['open', 'reviewing', 'resolved', 'dismissed'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status.' });
  }
  try {
    await pool.query('UPDATE reports SET status = $1 WHERE id = $2', [status, req.params.id]);
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update report.' });
  }
});

const httpServer = createServer(app);
attachChatServer(httpServer);

httpServer.listen(PORT, () => {
  console.log(`✅ API + WebSocket server running on http://localhost:${PORT}`);
  console.log(`   WebSocket chat endpoint: ws://localhost:${PORT}/ws/chat`);
});
