import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, UserCheck, FileCheck, Lock, AlertTriangle, Headphones } from 'lucide-react';

const disputeConversations = [
  {
    id: 1,
    incoming: "There is an issue with access parameters.",
    outgoing: "Our mediation team has opened formal file review."
  },
  {
    id: 2,
    incoming: "The landlord is requesting an unvetted fee.",
    outgoing: "Payment flagged. Escrow hold maintained securely."
  },
  {
    id: 3,
    incoming: "Inspection schedule doesn't match listing details.",
    outgoing: "Agent notified. Field verification team dispatched."
  }
];

// Split out Component for Card 5 to isolate states cleanly without re-rendering the whole section
function ScamAlertVisual() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [resetTrigger, setResetTrigger] = useState(0);

  useEffect(() => {
    // 1. Line loads from 0% to 80% instantly over 2 seconds on mount.
    const loadDuration = 2000;
    
    const triggerAlarmTimeout = setTimeout(() => {
      setIsLoaded(true); // Engages the continuous alarm beeping logic
    }, loadDuration);

    // 2. Holds the alarm state for 3 minutes (180000ms) before cycling
    const totalCycleTime = loadDuration + 180000; 
    
    const cycleTimeout = setTimeout(() => {
      setIsLoaded(false);
      setResetTrigger(prev => prev + 1); // Triggers re-run loop anchor cleanly
    }, totalCycleTime);

    return () => {
      clearTimeout(triggerAlarmTimeout);
      clearTimeout(cycleTimeout);
    };
  }, [resetTrigger]);

  return (
    <div className="w-full max-w-[220px] bg-neutral-950 border border-neutral-800 p-3 space-y-2 font-mono text-[9px] min-h-[76px] flex flex-col justify-between">
      
      {/* Header status text nodes */}
      <div className="flex items-center justify-between font-bold font-sans h-3">
        {isLoaded ? (
          // Continuous smooth fading beep animation triggered only after loading completes
          <motion.span 
            animate={{ opacity: [1, 0.2, 1] }}
            transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
            className="flex items-center gap-1 text-red-500 font-mono text-[9px] tracking-wider"
          >
            <AlertTriangle size={10} className="text-red-500" /> ANOMALY DETECTED
          </motion.span>
        ) : (
          // Neutral scanning statement shown before the first load completes
          <span className="text-neutral-500 font-mono text-[9px] tracking-wider uppercase">
            System Scanning...
          </span>
        )}
        
        {/* Sync radar status light indicator */}
        <span className={`text-[7px] ${isLoaded ? 'text-red-500 animate-pulse' : 'text-neutral-600'}`}>
          ●
        </span>
      </div>

      {/* Progress tracking line bar canvas layout */}
      <div className="h-[2px] bg-neutral-900 w-full overflow-hidden relative">
        <motion.div
          key={resetTrigger} // Refreshes width position on cycle end frames
          initial={{ width: "0%" }}
          animate={{ width: "80%" }}
          transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }} // Fast cinematic deceleration sweep
          className={`h-full ${isLoaded ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 'bg-neutral-400'}`}
        />
      </div>

      <span className="text-neutral-500 block font-mono text-[8px] leading-none">
        {isLoaded ? "IP Geo-Mismatch Location flagged" : "Parsing active terminal gateway route..."}
      </span>
    </div>
  );
}

// Dispute Resolution Loop Visual (Card 6)
function DisputeLoopVisual() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % disputeConversations.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const activeChat = disputeConversations[index];

  return (
    <div className="w-full max-w-[220px] min-h-[100px] flex flex-col justify-center gap-2 overflow-hidden relative py-2">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeChat.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
          className="flex flex-col gap-2 w-full"
        >
          <div className="bg-white border border-neutral-200 rounded-xl rounded-br-none p-2 text-[10px] sm:text-[11px] text-neutral-700 self-start max-w-[85%] leading-snug shadow-3xs">
            {activeChat.incoming}
          </div>
          <div className="bg-[#c87928] text-white rounded-xl rounded-bl-none p-2 text-[10px] sm:text-[11px] self-end max-w-[85%] leading-snug font-medium shadow-3xs">
            {activeChat.outgoing}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

const features = [
  {
    num: '01',
    title: 'Anti-Double-Sell Protection',
    desc: 'Every property is registered on our blockchain-verified ledger. The same property cannot be rented or sold to two people simultaneously.',
    renderVisual: () => (
      <div className="w-full max-w-[240px] bg-neutral-50 border border-neutral-200/80 p-3 space-y-2 font-mono text-[10px] text-neutral-400">
        <div className="flex justify-between border-b border-neutral-100 pb-1.5 text-neutral-600 font-sans font-semibold">
          <span>LEDGER RECORD</span>
          <span className="text-emerald-600">VERIFIED</span>
        </div>
        <div className="flex items-center gap-2 bg-white p-1.5 border border-neutral-100 shadow-2xs">
          <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
          <span className="truncate text-neutral-700 font-sans font-medium">Tx_9082... Block Pinned</span>
        </div>
        <div className="flex items-center gap-2 opacity-40 bg-white p-1.5 border border-dashed border-neutral-200">
          <div className="w-2 h-2 rounded-full bg-neutral-300 shrink-0" />
          <span className="truncate">Duplicate Entry Blocked</span>
        </div>
      </div>
    )
  },
  {
    num: '02',
    title: 'Verified Agent Network',
    desc: 'Every agent on NestHaven has been background-checked, ID-verified, and licensed. Only genuine professionals handle your transaction.',
    renderVisual: () => (
      <div className="relative flex items-center justify-center w-full h-24">
        <div className="bg-white border border-neutral-200 p-3 flex items-center gap-3 shadow-xs max-w-[200px] w-full">
          <div className="w-8 h-8 bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-400 shrink-0">
            <UserCheck size={16} className="text-neutral-700" />
          </div>
          <div className="flex-1 min-w-0 space-y-1">
            <div className="h-2 w-16 bg-neutral-800" />
            <div className="h-1.5 w-24 bg-neutral-300" />
          </div>
        </div>
        <div className="absolute top-3 right-6 bg-amber-500 text-white font-sans text-[8px] font-bold tracking-widest uppercase px-1.5 py-0.5 shadow-sm">
          PASSED
        </div>
      </div>
    )
  },
  {
    num: '03',
    title: 'Document Verification',
    desc: 'We verify C of O, deed of assignment, and tenancy agreements before any property goes live. No fake listings.',
    renderVisual: () => (
      <div className="w-full max-w-[220px] space-y-1.5">
        {['Certificate of Occupancy', 'Deed of Assignment', 'Verified Land Matrix'].map((doc, i) => (
          <div key={doc} className="flex items-center justify-between bg-white border border-neutral-200 px-3 py-1.5">
            <div className="flex items-center gap-2">
              <FileCheck size={12} className="text-neutral-400" />
              <span className="text-[11px] font-medium text-neutral-700">{doc}</span>
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
          </div>
        ))}
      </div>
    )
  },
  {
    num: '04',
    title: 'Escrow Payment Protection',
    desc: 'Pay into a secure escrow account. Funds are only released to the landlord after you physically inspect and approve the property.',
    renderVisual: () => (
      <div className="w-full max-w-[240px] flex items-center gap-2">
        <div className="flex-1 bg-white border border-neutral-200 p-2 text-center space-y-1">
          <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider block">Capital</span>
          <div className="h-5 bg-neutral-50 border border-neutral-100 flex items-center justify-center text-[10px] font-mono text-neutral-800">₦7.5M</div>
        </div>
        <div className="shrink-0 flex flex-col items-center justify-center">
          <div className="w-6 h-6 rounded-full border border-dashed border-neutral-300 flex items-center justify-center bg-white shadow-2xs">
            <Lock size={10} className="text-amber-600" />
          </div>
          <span className="text-[8px] font-bold text-neutral-400 mt-1">ESCROW</span>
        </div>
        <div className="flex-1 bg-white border border-neutral-200 p-2 text-center space-y-1 opacity-40">
          <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider block">Landlord</span>
          <div className="h-5 bg-neutral-50 border border-neutral-100 flex items-center justify-center text-[10px] font-mono">PNDG</div>
        </div>
      </div>
    )
  },
  {
    num: '05',
    title: 'Scam Alert System',
    desc: 'Our AI monitors listings 24/7 for suspicious activity. Flagged listings are suspended instantly and investigated before reinstatement.',
    renderVisual: () => <ScamAlertVisual />
  },
  {
    num: '06',
    title: 'Dispute Resolution',
    desc: 'Dedicated support team handles landlord-tenant disputes. We mediate fairly and protect the interests of both parties.',
    renderVisual: () => <DisputeLoopVisual />
  },
];

export default function TrustSection() {
  return (
    <section className="py-32 bg-[#F9F6F0] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Blueprint Style Minimalist Header Section */}
        <div className="max-w-3xl mb-24 space-y-4">
          <p className="text-amber-600 text-xs font-bold tracking-[0.25em] uppercase">
            // RISK MITIGATION INFRASTRUCTURE
          </p>
          <h2
            className="font-serif font-light text-neutral-900 leading-[1.1] tracking-tight"
            style={{ fontSize: 'clamp(2.5rem, 5vw, 4.2rem)' }}
          >
            Why NestHaven is <br />
            <span className="font-serif italic text-neutral-700">Nigeria's Safest Environment</span>
          </h2>
          <p className="text-neutral-500 text-sm max-w-xl leading-relaxed font-normal">
            Real estate fragmentation across local channels costs consumers billions annually. NestHaven addresses asset tracking through strict, unified institutional validation protocols.
          </p>
        </div>

        {/* Blueprint Infinite Grid Canvas Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-t border-l border-dashed border-neutral-300">
          {features.map(({ num, title, desc, renderVisual }, i) => (
            <div
              key={title}
              className="relative p-8 md:p-10 bg-transparent border-r border-b border-dashed border-neutral-300 flex flex-col justify-between min-h-[420px] group hover:bg-neutral-100/40 transition-colors duration-300"
            >
              {/* Index Corner Marker */}
              <span className="absolute top-4 left-6 font-serif italic text-xs text-amber-600/70 font-medium tracking-wider select-none pointer-events-none">
                {num}
              </span>

              {/* Central Minimal Wireframe View */}
              <div className="w-full flex items-center justify-center py-8 select-none pointer-events-none mix-blend-multiply">
                {renderVisual()}
              </div>

              {/* Core Editorial Copy Layout */}
              <div className="space-y-3">
                <h3 className="font-sans font-black text-neutral-900 text-xs tracking-wider uppercase leading-tight">
                  {title}
                </h3>
                <p className="text-neutral-500 text-xs sm:text-sm leading-relaxed font-normal">
                  {desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
          className="mt-24 bg-neutral-950 p-8 sm:p-12 rounded-none flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 border border-neutral-800"
        >
          <div className="space-y-2">
            <h3 className="font-serif text-white text-2xl sm:text-3xl font-light tracking-tight">
              Initiate Risk-Mitigated Acquisition
            </h3>
            <p className="text-neutral-400 text-xs sm:text-sm max-w-xl leading-relaxed font-normal">
              Interact with over 50,000 verified platform nodes executing secure real estate transitions throughout the federation.
            </p>
          </div>
          <a
            href="/listings"
            className="inline-flex items-center gap-4 text-xs font-bold tracking-widest uppercase text-white bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 px-6 py-4 transition-all duration-300 rounded-none shrink-0 group"
          >
            Access Verified Directory
            <span className="w-6 h-px bg-white transition-all group-hover:w-10" />
          </a>
        </motion.div>

      </div>
    </section>
  );
}