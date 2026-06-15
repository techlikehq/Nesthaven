import React from 'react';
import { motion } from 'motion/react';
import { Search, ShieldCheck, KeyRound } from 'lucide-react';

const steps = [
  {
    number: '01',
    title: 'Search & Filter',
    desc: 'Browse thousands of verified listings by location, price, type, and neighbourhood score. Use our map view to explore areas.',
    renderVisual: () => (
      <div className="w-full max-w-[180px] bg-white border border-neutral-200 p-3 space-y-2 font-mono text-[9px] text-neutral-400 shadow-2xs">
        <div className="flex items-center gap-1.5 border-b border-neutral-100 pb-1.5 text-neutral-800 font-sans font-semibold">
          <Search size={10} className="text-amber-600" />
          <span>QUERY FILTER</span>
        </div>
        <div className="space-y-1">
          <div className="flex justify-between text-neutral-600 font-medium">
            <span>Location:</span> <span className="text-neutral-900 font-bold">Lekki Phase 1</span>
          </div>
          <div className="w-full bg-neutral-100 h-1 rounded-none overflow-hidden">
            <div className="bg-neutral-800 h-full w-full" />
          </div>
        </div>
        <div className="space-y-1">
          <div className="flex justify-between text-neutral-600 font-medium">
            <span>Security Index:</span> <span className="text-amber-600 font-bold">9.8/10</span>
          </div>
          <div className="w-full bg-neutral-100 h-1 rounded-none overflow-hidden">
            <div className="bg-amber-500 h-full w-[94%]" />
          </div>
        </div>
      </div>
    )
  },
  {
    number: '02',
    title: 'Verify & Inspect',
    desc: 'Connect directly with our verified agents via WhatsApp. Book an inspection. We confirm the property is available and legitimate before you pay.',
    renderVisual: () => (
      <div className="w-full max-w-[200px] flex flex-col gap-1.5 font-mono text-[9px]">
        <div className="bg-neutral-950 text-neutral-300 p-2 border border-neutral-800 rounded-none self-start max-w-[85%] leading-normal">
          Requesting physically checked status file...
        </div>
        <div className="bg-white text-neutral-800 border border-neutral-200 p-2 rounded-none self-end max-w-[90%] leading-normal flex items-center gap-2 shadow-2xs">
          <ShieldCheck size={11} className="text-emerald-600 shrink-0" />
          <span className="font-sans font-medium text-[10px]">NestHaven Agent Confirmed</span>
        </div>
      </div>
    )
  },
  {
    number: '03',
    title: 'Pay Safely & Move In',
    desc: 'Pay through our escrow system. Funds are held securely until you confirm the property matches the listing. Then get your keys — stress free.',
    renderVisual: () => (
      <div className="w-full max-w-[200px] bg-white/60 border border-neutral-200 p-3 flex flex-col items-center justify-center gap-2">
        <div className="flex items-center gap-3 w-full justify-center">
          <div className="bg-white border border-neutral-200 px-2 py-1 text-[10px] font-mono text-neutral-800 shadow-3xs">
            TENANT
          </div>
          <div className="flex-1 border-t border-dashed border-neutral-300 relative flex items-center justify-center">
            <KeyRound size={10} className="text-amber-600 absolute bg-[#F4F1EA] px-0.5" />
          </div>
          <div className="bg-white border border-neutral-200 px-2 py-1 text-[10px] font-mono text-neutral-400 opacity-50">
            OWNER
          </div>
        </div>
        <span className="text-[8px] font-mono font-bold tracking-widest text-emerald-600 uppercase mt-1">
          ● FUNDS APPORTIONED TO ESCROW
        </span>
      </div>
    )
  },
];

function BeepingCrosshairSquare({ className }: { className?: string }) {
  return (
    <div className={`absolute w-3 h-3 flex items-center justify-center z-20 select-none pointer-events-none ${className}`}>
      <motion.div 
        animate={{ scale: [1, 1.8, 1], opacity: [0.25, 0.6, 0.25] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute w-2.5 h-2.5 rounded-none bg-amber-600/30 border border-amber-600/40"
      />
      <motion.div 
        animate={{ opacity: [1, 0.4, 1] }}
        transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
        className="w-1 h-1 rounded-none bg-amber-600 shadow-[0_0_4px_rgba(217,119,6,0.4)]"
      />
    </div>
  );
}

export default function HowItWorks() {
  return (
    <section className="py-32 bg-[#F4F1EA] overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Editorial Top Heading Frame Block */}
        <div className="max-w-3xl mb-24 space-y-4">
          <p className="text-amber-600 text-xs font-bold tracking-[0.25em] uppercase">
            // VETTING AND PROTOCOL LIFECYCLE
          </p>
          <h2
            className="font-serif font-light text-neutral-900 leading-[1.1] tracking-tight"
            style={{ fontSize: 'clamp(2.5rem, 4.5vw, 3.8rem)' }}
          >
            The Linear Blueprint of <br />
            <span className="font-serif italic text-neutral-700">Operational Risk Control</span>
          </h2>
          <div className="w-12 h-px bg-neutral-400/60 my-6" />
          <p className="text-neutral-500 text-sm leading-relaxed font-normal max-w-sm">
            A systematically controlled horizontal sequence isolating capital risk vectors across every layer of the procurement environment.
          </p>
        </div>

        {/* Premium Geometric Blueprint Architecture Layout Frame */}
        <div className="relative grid grid-cols-1 md:grid-cols-3 border border-neutral-400/70 bg-neutral-100/20 backdrop-blur-xs">
          
          {/* Outer Boundary Perimeter Corner Nodes */}
          <BeepingCrosshairSquare className="-top-1.5 -left-1.5" />
          <BeepingCrosshairSquare className="-top-1.5 -right-1.5" />
          <BeepingCrosshairSquare className="-bottom-1.5 -left-1.5" />
          <BeepingCrosshairSquare className="-bottom-1.5 -right-1.5" />

          {/* Internal Desktop Grid Splits */}
          <BeepingCrosshairSquare className="hidden md:flex left-[33.3333%] -translate-x-1/2 -top-1.5" />
          <BeepingCrosshairSquare className="hidden md:flex left-[66.6666%] -translate-x-1/2 -top-1.5" />
          <BeepingCrosshairSquare className="hidden md:flex left-[33.3333%] -translate-x-1/2 -bottom-1.5" />
          <BeepingCrosshairSquare className="hidden md:flex left-[66.6666%] -translate-x-1/2 -bottom-1.5" />

          {steps.map(({ number, title, desc, renderVisual }, i) => (
            <motion.div
              key={number}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="relative p-8 md:p-10 border-b md:border-b-0 md:border-r border-neutral-400/70 last:border-b-0 last:border-r-0 flex flex-col justify-between min-h-[440px] group transition-all duration-500 hover:bg-white/40"
            >
              <div className="flex items-center justify-between border-b border-neutral-300/40 pb-4">
                <span className="font-mono text-[10px] tracking-widest text-neutral-400 uppercase">
                  METRIC PHASE
                </span>
                <span className="font-serif italic text-xs text-amber-600/80 font-medium">
                  {number}
                </span>
              </div>

              <div className="w-full flex items-center justify-center py-8 select-none pointer-events-none mix-blend-multiply">
                {renderVisual()}
              </div>

              <div className="space-y-3">
                <h3 className="font-sans font-black text-neutral-900 text-xs tracking-wider uppercase leading-tight">
                  {title}
                </h3>
                <p className="text-neutral-500 text-xs sm:text-sm leading-relaxed font-normal">
                  {desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Clean Architectural Cost Calculator Node */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
          className="mt-24 border border-neutral-400/70 p-8 sm:p-12 bg-white/40 relative"
        >
          <BeepingCrosshairSquare className="-top-1.5 -left-1.5" />
          <BeepingCrosshairSquare className="-top-1.5 -right-1.5" />
          <BeepingCrosshairSquare className="-bottom-1.5 -left-1.5" />
          <BeepingCrosshairSquare className="-bottom-1.5 -right-1.5" />

          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div className="space-y-2">
              <h3 className="font-serif font-light text-neutral-900 text-2xl tracking-tight">
                Calculate Structural Allocation Overhead
              </h3>
              <p className="text-neutral-500 text-xs sm:text-sm max-w-xl leading-relaxed">
                Review rent schedules, official agency parameters, legal auditing parameters, and caution provisions transparently before moving capital forward.
              </p>
            </div>
            
            <div className="w-full lg:w-auto flex flex-wrap sm:flex-nowrap items-center gap-6 sm:gap-8 justify-between lg:justify-end text-sm">
              <div className="border-l border-neutral-300 pl-4 py-1">
                <p className="font-mono text-xs font-bold text-neutral-900">10%</p>
                <p className="text-neutral-400 text-[10px] uppercase tracking-wider font-medium mt-0.5">Agency</p>
              </div>
              <div className="border-l border-neutral-300 pl-4 py-1">
                <p className="font-mono text-xs font-bold text-neutral-900">05%</p>
                <p className="text-neutral-400 text-[10px] uppercase tracking-wider font-medium mt-0.5">Legal</p>
              </div>
              <div className="border-l border-neutral-300 pl-4 py-1">
                <p className="font-mono text-xs font-bold text-neutral-900">10%</p>
                <p className="text-neutral-400 text-[10px] uppercase tracking-wider font-medium mt-0.5">Caution</p>
              </div>
              
              {/* Enhanced Action Button Area with Heavy Geometric Framelines */}
              <div className="relative w-full sm:w-auto group/btn pt-1 px-1">
                {/* Thick Expanding Structural Ring Frame */}
                <motion.div 
                  animate={{ 
                    scale: [1, 1.08, 1],
                    opacity: [0.5, 0, 0.5]
                  }}
                  transition={{ 
                    duration: 1.8, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                  className="absolute inset-0 border-2 border-amber-600 rounded-none pointer-events-none z-0"
                />

                {/* Ambient Soft Blur Radian Glow Background */}
                <motion.div 
                  animate={{ 
                    scale: [1, 1.04, 1],
                    opacity: [0.2, 0.4, 0.2]
                  }}
                  transition={{ 
                    duration: 1.8, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                  className="absolute inset-0 bg-amber-600/30 rounded-none pointer-events-none z-0 blur-xs"
                />

                {/* Primary Thick Action Interface Anchor */}
                <a
                  href="/listings"
                  className="relative z-10 w-full sm:w-auto text-center inline-flex items-center justify-center gap-3 text-xs font-bold tracking-widest uppercase text-white bg-neutral-950 hover:bg-amber-600 hover:text-neutral-950 px-8 py-4.5 transition-all duration-300 rounded-none shrink-0 border-2 border-neutral-800 shadow-lg group-hover/btn:border-amber-600 font-sans"
                >
                  {/* Dynamic Laser Signal Node indicator */}
                  <span className="relative flex h-2 w-2 shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-none bg-amber-400 opacity-90"></span>
                    <span className="relative inline-flex rounded-none h-2 w-2 bg-amber-500"></span>
                  </span>
                  <span>Run Calculator</span>
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}