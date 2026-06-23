import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, MessageCircle, Shield, ShieldCheck, Check, CheckCheck, AlertTriangle, Flag } from 'lucide-react';

const WS_URL = (import.meta as any).env?.VITE_WS_URL || 'ws://localhost:4000/ws/chat';
const API_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:4000';

interface ChatMessage {
id: string;
sender_type: 'renter' | 'agent';
body: string;
read_at: string | null;
created_at: string;
}

interface ChatPanelProps {
open: boolean;
onClose: () => void;
agentId: string;
agentName: string;
agentPhoto?: string;
agentVerified?: boolean;
propertyId?: string;
propertyTitle?: string;
}

function IntakeForm({ onSubmit }: { onSubmit: (name: string, phone: string) => void }) {
const [name, setName] = useState('');
const [phone, setPhone] = useState('');

const handleSubmit = (e: React.FormEvent) => {
e.preventDefault();
if (name.trim() && phone.trim()) onSubmit(name.trim(), phone.trim());
};

return (
<form onSubmit={handleSubmit} className="flex-1 flex flex-col justify-center px-6 py-8 overflow-y-auto">
<div className="mb-6">
<div className="w-11 h-11 bg-amber-50 border border-amber-200 flex items-center justify-center mb-4">
<Shield size={18} className="text-amber-600" />
</div>
<h3 className="font-serif text-xl font-medium text-neutral-900 mb-2">Start a Secure Chat</h3>
<p className="text-sm text-neutral-500 leading-relaxed">
Conversations on NestHaven are kept on record. Your phone number is never shared with the other party — keep all communication and payments on-platform.
</p>
</div>

<div className="space-y-4 mb-6">
<div>
<label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block mb-1.5">Your Name</label>
<input
required value={name} onChange={e => setName(e.target.value)}
placeholder="Jane Smith"
className="w-full border border-neutral-300 px-4 py-3 text-sm focus:outline-none focus:border-amber-600 transition-colors"
/>
</div>
<div>
<label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block mb-1.5">Phone Number</label>
<input
required value={phone} onChange={e => setPhone(e.target.value)}
placeholder="+234 801 234 5678"
className="w-full border border-neutral-300 px-4 py-3 text-sm focus:outline-none focus:border-amber-600 transition-colors"
/>
<p className="text-[10px] text-neutral-400 mt-1.5">Used only to identify you on return visits — never shown to the agent.</p>
</div>
</div>

<button
type="submit"
className="w-full py-3.5 bg-neutral-900 hover:bg-amber-600 text-white text-xs font-bold tracking-widest uppercase transition-colors"
>
Start Chat
</button>
</form>
);
}

function SafetyModal({ onAcknowledge }: { onAcknowledge: () => void }) {
return (
<div className="absolute inset-0 z-10 bg-white flex flex-col justify-center px-6 py-8 overflow-y-auto">
<div className="w-11 h-11 bg-red-50 border border-red-200 flex items-center justify-center mb-4">
<AlertTriangle size={18} className="text-red-600" />
</div>
<h3 className="font-serif text-xl font-medium text-neutral-900 mb-3">Stay Safe on NestHaven</h3>
<ul className="space-y-2.5 mb-6 text-sm text-neutral-600">
<li className="flex gap-2"><span className="text-amber-600 shrink-0">•</span> Keep all communication on NestHaven — phone numbers can't be shared here.</li>
<li className="flex gap-2"><span className="text-amber-600 shrink-0">•</span> Never pay or send money outside the platform.</li>
<li className="flex gap-2"><span className="text-amber-600 shrink-0">•</span> Report anyone who asks you to chat or pay elsewhere.</li>
</ul>
<button
onClick={onAcknowledge}
className="w-full py-3.5 bg-neutral-900 hover:bg-amber-600 text-white text-xs font-bold tracking-widest uppercase transition-colors"
>
I Understand, Continue
</button>
</div>
);
}

function ReportModal({ onClose, onSubmit }: { onClose: () => void; onSubmit: (reason: string, details: string) => void }) {
const [reason, setReason] = useState('asked_off_platform_contact');
const [details, setDetails] = useState('');

return (
<div className="absolute inset-0 z-20 bg-black/40 flex items-end sm:items-center justify-center">
<div className="bg-white w-full sm:max-w-sm p-6 max-h-[90%] overflow-y-auto">
<div className="flex items-center justify-between mb-4">
<h3 className="font-serif text-lg font-medium text-neutral-900">Report This Conversation</h3>
<button onClick={onClose} className="text-neutral-400 hover:text-neutral-700"><X size={18} /></button>
</div>
<div className="space-y-2 mb-4">
{[
{ value: 'asked_off_platform_contact', label: 'Asked me to chat elsewhere' },
{ value: 'asked_off_platform_payment', label: 'Asked for off-platform payment' },
{ value: 'suspicious_behavior', label: 'Suspicious behavior' },
{ value: 'other', label: 'Other' },
].map(opt => (
<label key={opt.value} className="flex items-center gap-2.5 text-sm text-neutral-700 cursor-pointer">
<input type="radio" name="reason" checked={reason === opt.value} onChange={() => setReason(opt.value)} />
{opt.label}
</label>
))}
</div>
<textarea
value={details}
onChange={e => setDetails(e.target.value)}
placeholder="Additional details (optional)"
rows={3}
className="w-full border border-neutral-300 px-3 py-2.5 text-sm focus:outline-none focus:border-amber-600 mb-4 resize-none"
/>
<button
onClick={() => onSubmit(reason, details)}
className="w-full py-3 bg-red-600 hover:bg-red-700 text-white text-xs font-bold tracking-widest uppercase transition-colors"
>
Submit Report
</button>
</div>
</div>
);
}

export default function ChatPanel({
open, onClose, agentId, agentName, agentPhoto, agentVerified, propertyId, propertyTitle,
}: ChatPanelProps) {
const [conversationId, setConversationId] = useState<string | null>(null);
const [messages, setMessages] = useState<ChatMessage[]>([]);
const [input, setInput] = useState('');
const [connected, setConnected] = useState(false);
const [showSafetyModal, setShowSafetyModal] = useState(false);
const [showReportModal, setShowReportModal] = useState(false);
const [banner, setBanner] = useState<{ type: 'blocked' | 'warning'; text: string } | null>(null);
const [flaggedMessageIds, setFlaggedMessageIds] = useState<Set<string>>(new Set());
const wsRef = useRef<WebSocket | null>(null);
const scrollRef = useRef<HTMLDivElement>(null);

useEffect(() => {
if (open && !localStorage.getItem('nh_safety_ack')) {
setShowSafetyModal(true);
}
}, [open]);

const startConversation = useCallback(async (name: string, phone: string) => {
try {
const res = await fetch(`${API_URL}/api/conversations`, {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({
propertyId: propertyId ?? null,
agentId,
renterName: name,
renterPhone: phone,
}),
});
const data = await res.json();
setConversationId(data.conversationId);
} catch (err) {
console.error('Failed to start conversation', err);
}
}, [agentId, propertyId]);

useEffect(() => {
if (!conversationId) return;

const ws = new WebSocket(WS_URL);
wsRef.current = ws;

ws.onopen = () => {
setConnected(true);
ws.send(JSON.stringify({ type: 'join', conversationId, senderType: 'renter' }));
};

ws.onmessage = (event) => {
const data = JSON.parse(event.data);
if (data.type === 'history') {
setMessages(data.messages);
ws.send(JSON.stringify({ type: 'read', conversationId, senderType: 'renter' }));
} else if (data.type === 'message') {
setMessages(prev => [...prev, data.message]);
if (data.message.sender_type === 'agent') {
ws.send(JSON.stringify({ type: 'read', conversationId, senderType: 'renter' }));
}
} else if (data.type === 'read_receipt') {
setMessages(prev => prev.map(m =>
m.sender_type === 'renter' ? { ...m, read_at: m.read_at ?? new Date().toISOString() } : m
));
} else if (data.type === 'blocked') {
setBanner({ type: 'blocked', text: data.message });
setTimeout(() => setBanner(null), 6000);
} else if (data.type === 'safety_warning') {
if (data.messageId) {
setFlaggedMessageIds(prev => new Set(prev).add(data.messageId));
}
}
};

ws.onclose = () => setConnected(false);

return () => ws.close();
}, [conversationId]);

useEffect(() => {
scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
}, [messages]);

const sendMessage = () => {
const body = input.trim();
if (!body || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
wsRef.current.send(JSON.stringify({ type: 'message', conversationId, senderType: 'renter', body }));
setInput('');
};

const submitReport = async (reason: string, details: string) => {
try {
await fetch(`${API_URL}/api/reports`, {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ conversationId, reportedBy: 'renter', reason, details }),
});
setShowReportModal(false);
setBanner({ type: 'warning', text: 'Report submitted. Our team will review this conversation.' });
setTimeout(() => setBanner(null), 6000);
} catch (err) {
console.error('Failed to submit report', err);
}
};

return (
<AnimatePresence>
{open && (
<>
<motion.div
initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
className="fixed inset-0 bg-black/40 z-[100]"
onClick={onClose}
/>
{/* FIX: h-screen + max-h-screen + overflow-hidden locks the panel to viewport height.
Without this, the panel grows with content and the whole PAGE scrolls instead
of just the messages list inside it. */}
<motion.div
initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
transition={{ type: 'spring', damping: 32, stiffness: 320 }}
className="fixed right-0 top-0 bottom-0 w-full sm:w-[420px] h-screen max-h-screen bg-white z-[101] flex flex-col shadow-2xl overflow-hidden"
>
{showSafetyModal && (
<SafetyModal onAcknowledge={() => {
localStorage.setItem('nh_safety_ack', '1');
setShowSafetyModal(false);
}} />
)}
{showReportModal && (
<ReportModal onClose={() => setShowReportModal(false)} onSubmit={submitReport} />
)}

{/* Header — flex-shrink-0 keeps it pinned, never scrolls */}
<div className="flex-shrink-0 flex items-center justify-between px-5 py-4 border-b border-neutral-200 bg-neutral-950">
<div className="flex items-center gap-3 min-w-0">
{agentPhoto && (
<div className="w-9 h-9 rounded-full overflow-hidden bg-neutral-800 shrink-0">
<img src={agentPhoto} alt={agentName} className="w-full h-full object-cover" />
</div>
)}
<div className="min-w-0">
<p className="text-sm font-semibold text-white truncate flex items-center gap-1.5">
{agentName}
{agentVerified && <ShieldCheck size={11} className="text-emerald-400 shrink-0" />}
</p>
{propertyTitle && <p className="text-[10px] text-neutral-400 truncate">{propertyTitle}</p>}
</div>
</div>
<div className="flex items-center gap-1 shrink-0">
{conversationId && (
<button onClick={() => setShowReportModal(true)} className="p-2 text-neutral-400 hover:text-red-400 transition-colors" title="Report">
<Flag size={15} />
</button>
)}
<button onClick={onClose} className="p-2 text-neutral-400 hover:text-white transition-colors">
<X size={18} />
</button>
</div>
</div>

{!conversationId ? (
<IntakeForm onSubmit={startConversation} />
) : (
<>
{/* Status bar — flex-shrink-0, stays pinned under header */}
<div className={`flex-shrink-0 px-5 py-1.5 text-[10px] font-mono flex items-center gap-1.5 ${connected ? 'text-emerald-600 bg-emerald-50' : 'text-amber-600 bg-amber-50'}`}>
<span className={`w-1.5 h-1.5 rounded-full ${connected ? 'bg-emerald-500' : 'bg-amber-500'}`} />
{connected ? 'NestHaven Trusted Chat' : 'Connecting...'}
</div>

{/* Messages — min-h-0 is the critical fix here.
Without min-h-0, a flex child won't shrink below its content size,
which is exactly why the box was growing instead of scrolling internally. */}
<div ref={scrollRef} className="flex-1 min-h-0 overflow-y-auto px-5 py-4 space-y-3 bg-[#F9F6F0]">
{messages.length === 0 && (
<div className="text-center py-10">
<MessageCircle size={28} className="text-neutral-300 mx-auto mb-2" />
<p className="text-xs text-neutral-400">Say hello to start the conversation.</p>
</div>
)}
{messages.map(m => (
<React.Fragment key={m.id}>
<div className={`flex ${m.sender_type === 'renter' ? 'justify-end' : 'justify-start'}`}>
<div className={`max-w-[80%] px-4 py-2.5 text-sm leading-snug ${
m.sender_type === 'renter'
? 'bg-neutral-900 text-white rounded-2xl rounded-br-sm'
: 'bg-white border border-neutral-200 text-neutral-800 rounded-2xl rounded-bl-sm'
}`}>
{m.body}
<div className={`flex items-center gap-1 mt-1 text-[9px] ${m.sender_type === 'renter' ? 'text-white/50 justify-end' : 'text-neutral-400'}`}>
{new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
{m.sender_type === 'renter' && (m.read_at ? <CheckCheck size={11} /> : <Check size={11} />)}
</div>
</div>
</div>
{flaggedMessageIds.has(m.id) && (
<div className={`flex ${m.sender_type === 'renter' ? 'justify-end' : 'justify-start'}`}>
<div className="max-w-[80%] px-3.5 py-2.5 bg-red-50 border border-red-200 text-red-700 text-[11px] leading-snug flex items-start gap-2">
<AlertTriangle size={13} className="shrink-0 mt-0.5" />
<span>Keep all communication and payments on NestHaven. Never share contact details or send money outside the platform.</span>
</div>
</div>
)}
</React.Fragment>
))}
</div>

{/* Input — flex-shrink-0 keeps it pinned at the bottom, never scrolls away */}
<div className="flex-shrink-0 flex items-center gap-2 px-4 py-3 border-t border-neutral-200">
<input
value={input}
onChange={e => setInput(e.target.value)}
onKeyDown={e => e.key === 'Enter' && sendMessage()}
placeholder="Type a message..."
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
</motion.div>
</>
)}
</AnimatePresence>
);
}
