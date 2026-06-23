import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, Link } from 'react-router';
import { Send, MessageCircle, Check, CheckCheck, ArrowLeft, Home, AlertTriangle } from 'lucide-react';
import { agents } from '../data/properties';

const WS_URL = (import.meta as any).env?.VITE_WS_URL || 'ws://localhost:4000/ws/chat';
const API_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:4000';

interface ConversationSummary {
  id: string;
  property_title: string | null;
  renter_name: string;
  status: 'active' | 'closed' | 'disputed';
  last_message: string | null;
  unread_count: string;
  updated_at: string;
}

interface ChatMessage {
  id: string;
  sender_type: 'renter' | 'agent';
  body: string;
  read_at: string | null;
  created_at: string;
}

export default function AgentInboxPage() {
  const { agentId } = useParams();
  const agent = agents.find(a => a.id === agentId);

  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [connected, setConnected] = useState(false);
  const [flaggedMessageIds, setFlaggedMessageIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const wsRef = useRef<WebSocket | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const fetchConversations = useCallback(async () => {
    if (!agentId) return;
    try {
      const res = await fetch(`${API_URL}/api/conversations/agent/${agentId}`);
      const data = await res.json();
      setConversations(data);
    } catch (err) {
      console.error('Failed to fetch conversations', err);
    } finally {
      setLoading(false);
    }
  }, [agentId]);

  useEffect(() => {
    fetchConversations();
    const interval = setInterval(fetchConversations, 8000);
    return () => clearInterval(interval);
  }, [fetchConversations]);

  useEffect(() => {
    if (!activeId) return;

    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;
    setMessages([]);
    setFlaggedMessageIds(new Set());

    ws.onopen = () => {
      setConnected(true);
      ws.send(JSON.stringify({ type: 'join', conversationId: activeId, senderType: 'agent' }));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'history') {
        setMessages(data.messages);
        ws.send(JSON.stringify({ type: 'read', conversationId: activeId, senderType: 'agent' }));
      } else if (data.type === 'message') {
        setMessages(prev => [...prev, data.message]);
        if (data.message.sender_type === 'renter') {
          ws.send(JSON.stringify({ type: 'read', conversationId: activeId, senderType: 'agent' }));
        }
        fetchConversations();
      } else if (data.type === 'read_receipt') {
        setMessages(prev => prev.map(m =>
          m.sender_type === 'agent' ? { ...m, read_at: m.read_at ?? new Date().toISOString() } : m
        ));
      } else if (data.type === 'safety_warning') {
        if (data.messageId) {
          setFlaggedMessageIds(prev => new Set(prev).add(data.messageId));
        }
      }
    };

    ws.onclose = () => setConnected(false);

    return () => ws.close();
  }, [activeId, fetchConversations]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    const body = input.trim();
    if (!body || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
    wsRef.current.send(JSON.stringify({ type: 'message', conversationId: activeId, senderType: 'agent', body }));
    setInput('');
  };

  const activeConvo = conversations.find(c => c.id === activeId);

  if (!agent) {
    return (
      <main className="bg-[#F9F6F0] min-h-screen pt-28 pb-24 flex items-center justify-center">
        <div className="text-center px-6">
          <h1 className="font-serif text-3xl text-neutral-900 mb-3">Agent Not Found</h1>
          <Link to="/" className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-white bg-neutral-900 hover:bg-amber-600 px-6 py-3.5 transition-colors">
            <Home size={14} /> Back Home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-[#F9F6F0] min-h-screen pt-24 pb-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <Link to="/" className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-neutral-500 hover:text-amber-600 transition-colors mb-4">
          <ArrowLeft size={14} /> Back Home
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full overflow-hidden bg-neutral-100">
            <img src={agent.photo} alt={agent.name} className="w-full h-full object-cover" />
          </div>
          <div>
            <h1 className="font-serif text-2xl font-medium text-neutral-900">Inbox — {agent.name}</h1>
            <p className="text-xs text-neutral-500">{agent.agency}</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 border border-neutral-200 bg-white h-[calc(100vh-220px)] min-h-[500px]">

          <div className={`lg:col-span-4 border-r border-neutral-200 overflow-y-auto ${activeId ? 'hidden lg:block' : ''}`}>
            {loading && (
              <div className="p-6 text-center text-sm text-neutral-400">Loading conversations...</div>
            )}
            {!loading && conversations.length === 0 && (
              <div className="p-6 text-center">
                <MessageCircle size={28} className="text-neutral-300 mx-auto mb-2" />
                <p className="text-xs text-neutral-400">No conversations yet.</p>
              </div>
            )}
            {conversations.map(c => {
              const unread = parseInt(c.unread_count, 10);
              return (
                <button
                  key={c.id}
                  onClick={() => setActiveId(c.id)}
                  className={`w-full text-left px-5 py-4 border-b border-neutral-100 hover:bg-neutral-50 transition-colors ${activeId === c.id ? 'bg-amber-50' : ''}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold text-neutral-900 truncate">{c.renter_name}</span>
                    {unread > 0 && (
                      <span className="w-5 h-5 rounded-full bg-amber-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                        {unread}
                      </span>
                    )}
                  </div>
                  {c.property_title && (
                    <p className="text-[11px] text-neutral-400 truncate mb-1">{c.property_title}</p>
                  )}
                  <p className="text-xs text-neutral-500 truncate">{c.last_message ?? 'No messages yet'}</p>
                  {c.status === 'disputed' && (
                    <span className="inline-block mt-1.5 text-[9px] font-bold uppercase tracking-wider text-red-600 bg-red-50 border border-red-200 px-1.5 py-0.5">
                      Disputed
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className={`lg:col-span-8 flex flex-col ${!activeId ? 'hidden lg:flex' : ''}`}>
            {!activeId ? (
              <div className="flex-1 flex items-center justify-center">
                <p className="text-sm text-neutral-400">Select a conversation to view messages.</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-200">
                  <div className="flex items-center gap-3 min-w-0">
                    <button onClick={() => setActiveId(null)} className="lg:hidden p-1 text-neutral-400">
                      <ArrowLeft size={16} />
                    </button>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-neutral-900 truncate">{activeConvo?.renter_name}</p>
                      <p className="text-[10px] text-neutral-400 truncate">Identity verified by phone — number kept private</p>
                    </div>
                  </div>
                  <span className={`text-[9px] font-mono flex items-center gap-1 ${connected ? 'text-emerald-600' : 'text-amber-600'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${connected ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                    {connected ? 'Live' : 'Connecting'}
                  </span>
                </div>

                <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-4 space-y-3 bg-[#F9F6F0]">
                  {messages.map(m => (
                    <React.Fragment key={m.id}>
                      <div className={`flex ${m.sender_type === 'agent' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[75%] px-4 py-2.5 text-sm leading-snug ${
                          m.sender_type === 'agent'
                            ? 'bg-neutral-900 text-white rounded-2xl rounded-br-sm'
                            : 'bg-white border border-neutral-200 text-neutral-800 rounded-2xl rounded-bl-sm'
                        }`}>
                          {m.body}
                          <div className={`flex items-center gap-1 mt-1 text-[9px] ${m.sender_type === 'agent' ? 'text-white/50 justify-end' : 'text-neutral-400'}`}>
                            {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            {m.sender_type === 'agent' && (m.read_at ? <CheckCheck size={11} /> : <Check size={11} />)}
                          </div>
                        </div>
                      </div>
                      {flaggedMessageIds.has(m.id) && (
                        <div className={`flex ${m.sender_type === 'agent' ? 'justify-end' : 'justify-start'}`}>
                          <div className="max-w-[75%] px-3.5 py-2.5 bg-red-50 border border-red-200 text-red-700 text-[11px] leading-snug flex items-start gap-2">
                            <AlertTriangle size={13} className="shrink-0 mt-0.5" />
                            <span>This message was flagged for off-platform contact or payment language.</span>
                          </div>
                        </div>
                      )}
                    </React.Fragment>
                  ))}
                </div>

                <div className="flex items-center gap-2 px-4 py-3 border-t border-neutral-200">
                  <input
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && sendMessage()}
                    placeholder="Reply..."
                    className="flex-1 px-4 py-2.5 bg-neutral-100 text-sm focus:outline-none rounded-full"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!input.trim()}
                    className="w-10 h-10 rounded-full bg-neutral-900 hover:bg-amber-600 disabled:opacity-30 disabled:hover:bg-neutral-900 text-white flex items-center justify-center transition-colors shrink-0"
                  >
                    <Send size={15} />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
