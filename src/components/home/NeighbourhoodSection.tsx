import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router';
import {
  MapPin, TrendingUp, ArrowRight, Droplets, Zap, ShieldCheck,
  AlertTriangle, FileCheck, Waves, Route, ChevronDown,
} from 'lucide-react';
import { neighbourhoods, getScoreLabel } from '../../data/neighbourhoods';

const slugify = (name: string) => name.toLowerCase().replace(/[\s/]+/g, '-');

function StatRow({ icon: Icon, label, value, suffix }: { icon: any; label: string; value: number; suffix?: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <Icon size={12} className="text-neutral-400 shrink-0" strokeWidth={1.8} />
      <span className="text-[10px] text-neutral-500 w-24 shrink-0">{label}</span>
      <div className="flex-1 h-[3px] bg-neutral-100 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${value}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="h-full bg-amber-600"
          style={{ opacity: 0.45 + (value / 100) * 0.55 }}
        />
      </div>
      <span className="text-[10px] font-mono font-semibold text-neutral-700 w-12 text-right">{suffix ?? `${value}%`}</span>
    </div>
  );
}

const INITIAL_COUNT = 3;

export default function NeighbourhoodSection() {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? neighbourhoods : neighbourhoods.slice(0, INITIAL_COUNT);
  const hasMore = neighbourhoods.length > INITIAL_COUNT;

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14">
          <div>
            <p className="text-amber-600 text-xs font-bold tracking-[0.25em] uppercase mb-3">
              // AREA INTELLIGENCE
            </p>
            <h2 className="font-serif font-light text-neutral-900 leading-tight"
                style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
              Know Before <span className="italic text-neutral-600">You Move</span>
            </h2>
            <p className="text-neutral-500 text-sm mt-2 max-w-md">
              Real drainage, power, and water data for every neighbourhood — not just a score, the full picture.
            </p>
          </div>
          <Link to="/areas" className="flex items-center gap-2 text-amber-600 font-semibold text-sm hover:gap-3 transition-all">
            View All Areas <ArrowRight size={15} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {visible.map((hood, i) => {
              const { label, color } = getScoreLabel(hood.score);
              const { intelligence: intel } = hood;

              return (
                <motion.div
                  key={hood.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4, delay: i < INITIAL_COUNT ? i * 0.08 : (i - INITIAL_COUNT) * 0.06 }}
                >
                  <Link
                    to={`/areas/${slugify(hood.name)}`}
                    className="block bg-white border border-neutral-200 hover:border-amber-300 hover:shadow-xl hover:shadow-neutral-200/60 transition-all duration-300 overflow-hidden h-full group"
                  >
                    <div className="relative h-44 overflow-hidden shrink-0">
                      <img src={hood.image} alt={hood.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/85 via-neutral-950/10 to-transparent" />

                      {hood.trending && (
                        <span className="absolute top-3 left-3 inline-flex items-center gap-1 px-2 py-1 bg-amber-600 text-white text-[9px] font-bold tracking-widest uppercase">
                          <TrendingUp size={9} /> Trending
                        </span>
                      )}

                      <div className="absolute top-3 right-3 w-11 h-11 rounded-full bg-[#F9F6F0]/95 backdrop-blur-sm flex flex-col items-center justify-center shadow-md">
                        <span className="font-serif text-base font-bold text-neutral-900 leading-none">{hood.score}</span>
                      </div>

                      <div className="absolute bottom-3 left-4">
                        <h3 className="font-serif text-xl font-medium text-white leading-tight">{hood.name}</h3>
                        <p className="flex items-center gap-1 text-[10px] text-white/65 mt-0.5">
                          <MapPin size={9} /> {hood.city}, {hood.state}
                        </p>
                      </div>
                    </div>

                    <div className="p-5">

                      <div className="flex items-center justify-between mb-4">
                        <span
                          className="text-[9px] font-bold tracking-widest uppercase px-2 py-1 border"
                          style={{ color, borderColor: `${color}40`, backgroundColor: `${color}0D` }}
                        >
                          {label}
                        </span>
                        <span className="text-[9px] font-mono text-neutral-400 uppercase tracking-wider">Area Score</span>
                      </div>

                      <div className="border border-neutral-200 bg-neutral-50/60 p-4 mb-4">
                        <p className="flex items-center gap-1.5 text-[9px] font-bold tracking-widest uppercase text-neutral-500 mb-3">
                          <MapPin size={11} className="text-amber-600" /> Neighbourhood Report
                        </p>
                        <div className="space-y-2.5">
                          <StatRow icon={Droplets} label="Drainage" value={intel.drainage} />
                          <StatRow icon={Zap} label="Power" value={intel.powerScore} suffix={intel.powerHoursPerDay} />
                          <StatRow icon={ShieldCheck} label="Security" value={hood.ratings.security} />
                          <StatRow icon={Route} label="Road Network" value={hood.ratings.transport} />
                        </div>

                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-dashed border-neutral-200">
                          <span className="flex items-center gap-1.5 text-[10px] text-neutral-500">
                            <Droplets size={11} className="text-sky-500" /> {intel.waterSupply.source}
                          </span>
                          <span className="text-[10px] font-bold text-sky-600">{intel.waterSupply.label}</span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-dashed border-neutral-200">
                          {intel.floodRisk ? (
                            <span className="inline-flex items-center justify-center gap-1.5 text-[10px] font-bold text-orange-700 bg-orange-50 border border-orange-200 px-3 py-2">
                              <AlertTriangle size={11} /> Flood Risk
                            </span>
                          ) : (
                            <span className="inline-flex items-center justify-center gap-1.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-2">
                              <Waves size={11} /> No Flooding
                            </span>
                          )}
                          {intel.cOfO && (
                            <span className="inline-flex items-center justify-center gap-1.5 text-[10px] font-bold text-neutral-600 bg-white border border-neutral-200 px-3 py-2">
                              <FileCheck size={11} /> C of O
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <div>
                          <p className="text-[9px] text-neutral-400 uppercase tracking-wider">Avg. Rent</p>
                          <p className="font-mono text-sm font-bold text-neutral-900">
                            ₦{(hood.avgRentApartment / 1000000).toFixed(1)}M<span className="text-[10px] font-normal text-neutral-400">/yr</span>
                          </p>
                        </div>
                        <span className="text-xs text-amber-600 font-semibold group-hover:underline">
                          View report →
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {hasMore && (
          <div className="flex justify-center mt-10">
            <button
              onClick={() => setShowAll(v => !v)}
              className="inline-flex items-center gap-2 px-6 py-3.5 border border-neutral-300 hover:border-neutral-900 text-xs font-bold tracking-widest uppercase text-neutral-700 hover:text-neutral-900 transition-colors"
            >
              {showAll ? 'Show Less' : `Show ${neighbourhoods.length - INITIAL_COUNT} More Areas`}
              <motion.span animate={{ rotate: showAll ? 180 : 0 }} transition={{ duration: 0.3 }}>
                <ChevronDown size={14} />
              </motion.span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
