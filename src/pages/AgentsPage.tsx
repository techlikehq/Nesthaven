import React, { useState, useMemo } from 'react';
import ChatPanel from '../components/chat/ChatPanel';
import { Shield, ShieldCheck, Star, MessageCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router';
import { agents, properties } from '../data/properties';

function AgentsPageChatTrigger({ agent }: { agent: any }) {
  const [chatOpen, setChatOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setChatOpen(true)}
        className="inline-flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase text-white bg-neutral-900 hover:bg-amber-600 px-4 py-2.5 transition-colors duration-300 w-full justify-center"
      >
        <MessageCircle size={11} /> Chat Securely
      </button>
      <ChatPanel
        open={chatOpen}
        onClose={() => setChatOpen(false)}
        agentId={agent.id}
        agentName={agent.name}
        agentPhoto={agent.photo}
        agentVerified={agent.verified}
      />
    </>
  );
}

export default function AgentsPage() {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return agents;
    return agents.filter(a =>
      a.name.toLowerCase().includes(q) || a.agency.toLowerCase().includes(q)
    );
  }, [search]);

  const dealsFor = (agentId: string) =>
    properties.filter(p => p.agent.id === agentId).length;

  return (
    <main className="bg-[#F9F6F0] min-h-screen pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <Link to="/" className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-neutral-500 hover:text-amber-600 transition-colors mb-10">
          <ArrowLeft size={14} /> Back Home
        </Link>

        <div className="max-w-3xl mb-14 space-y-4">
          <p className="text-amber-600 text-xs font-bold tracking-[0.25em] uppercase">
            // VERIFIED PROFESSIONALS
          </p>
          <h1
            className="font-serif font-light text-neutral-900 leading-[1.1] tracking-tight"
            style={{ fontSize: 'clamp(2.5rem, 5vw, 4.2rem)' }}
          >
            All <span className="font-serif italic text-neutral-700">Agents</span>
          </h1>
          <p className="text-neutral-500 text-sm max-w-xl leading-relaxed">
            Every agent on NestHaven is background-checked, licensed, and reviewed by real clients.
          </p>
        </div>

        <div className="mb-10 max-w-md">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search agents or agency..."
            className="w-full border border-neutral-300 bg-white px-4 py-3 text-sm focus:outline-none focus:border-amber-600 transition-colors"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-t border-l border-dashed border-neutral-300">
          {filtered.map(agent => (
            <div
              key={agent.id}
              className="relative p-8 border-r border-b border-dashed border-neutral-300 bg-transparent hover:bg-neutral-100/40 transition-colors duration-300 flex flex-col items-center text-center"
            >
              <div className="relative mb-6">
                <div className="w-16 h-16 border border-neutral-200 overflow-hidden bg-neutral-100">
                  <img src={agent.photo} alt={agent.name} className="w-full h-full object-cover" />
                </div>
                {agent.verified && (
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-amber-500 flex items-center justify-center">
                    <ShieldCheck size={10} className="text-white" />
                  </div>
                )}
              </div>

              <h3 className="font-sans font-black text-neutral-900 text-xs tracking-wider uppercase leading-tight mb-1">
                {agent.name}
              </h3>
              <p className="font-mono text-[9px] text-neutral-400 tracking-wider uppercase mb-4">
                {agent.agency}
              </p>

              <div className="flex items-center gap-3 mb-6">
                <span className="flex items-center gap-1 font-mono text-[10px] text-neutral-600">
                  <Star size={10} className="text-amber-500 fill-amber-500" />
                  {agent.rating}
                </span>
                <span className="w-px h-3 bg-neutral-200" />
                <span className="font-mono text-[10px] text-neutral-400">
                  {agent.deals} deals · {dealsFor(agent.id)} active
                </span>
              </div>

              <div className="w-full">
                <AgentsPageChatTrigger agent={agent} />
              </div>
            </div>
          ))}
        </div>
        
        {filtered.length === 0 && (
          <p className="text-center text-neutral-400 text-sm py-20">No agents match your search.</p>
        )}
      </div>
    </main>
  );
}