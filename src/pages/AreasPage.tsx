import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router';
import { MapPin, TrendingUp, ArrowLeft } from 'lucide-react';
import { neighbourhoods, getScoreLabel } from '../data/neighbourhoods';

function ScoreBar({ value }: { value: number }) {
  return (
    <div className="h-[2px] bg-neutral-200 w-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        whileInView={{ width: `${value}%` }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className={`h-full ${value >= 90 ? 'bg-emerald-500' : value >= 75 ? 'bg-amber-500' : 'bg-orange-500'}`}
      />
    </div>
  );
}

export default function AreasPage() {
  const [city, setCity] = useState('All Cities');

  const cities = useMemo(
    () => ['All Cities', ...Array.from(new Set(neighbourhoods.map(h => h.city)))],
    []
  );

  const filtered = useMemo(
    () => city === 'All Cities' ? neighbourhoods : neighbourhoods.filter(h => h.city === city),
    [city]
  );

  return (
    <main className="bg-[#F9F6F0] min-h-screen pt-28 pb-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <Link to="/" className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-neutral-500 hover:text-amber-600 transition-colors mb-10">
          <ArrowLeft size={14} /> Back Home
        </Link>

        <div className="max-w-3xl mb-12 space-y-4">
          <p className="text-amber-600 text-xs font-bold tracking-[0.25em] uppercase">
            // AREA INTELLIGENCE
          </p>
          <h1
            className="font-serif font-light text-neutral-900 leading-[1.1] tracking-tight"
            style={{ fontSize: 'clamp(2.5rem, 5vw, 4.2rem)' }}
          >
            Know Before <br />
            <span className="font-serif italic text-neutral-700">You Move</span>
          </h1>
          <p className="text-neutral-500 text-sm max-w-xl leading-relaxed">
            Our proprietary scoring ranks every neighbourhood on security, infrastructure, flooding risk, transport, and amenities.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mb-12">
          {cities.map(c => (
            <button
              key={c}
              onClick={() => setCity(c)}
              className={`px-4 py-2 text-[11px] font-bold tracking-widest uppercase border transition-colors ${
                city === c
                  ? 'bg-neutral-900 text-white border-neutral-900'
                  : 'bg-white text-neutral-500 border-neutral-300 hover:border-neutral-900'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-t border-l border-dashed border-neutral-300">
          {filtered.map((hood, i) => {
            const { label, color } = getScoreLabel(hood.score);
            return (
              <motion.div
                key={hood.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="group relative border-r border-b border-dashed border-neutral-300 bg-transparent hover:bg-neutral-100/40 transition-colors duration-300 overflow-hidden"
              >
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={hood.image}
                    alt={hood.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-neutral-950/20 to-transparent" />
                  <div className="absolute bottom-4 left-5 flex items-center gap-2">
                    <span className="flex items-center gap-1.5 text-white font-sans font-semibold text-sm tracking-wide">
                      <MapPin size={11} className="text-amber-400" />
                      {hood.name}
                    </span>
                    {hood.trending && (
                      <span className="flex items-center gap-1 px-2 py-0.5 bg-amber-500 text-white text-[9px] font-bold tracking-widest uppercase">
                        <TrendingUp size={8} /> HOT
                      </span>
                    )}
                  </div>
                  <div className="absolute top-4 right-4 w-10 h-10 bg-neutral-950/80 border border-white/10 flex items-center justify-center backdrop-blur-sm">
                    <span className="font-mono text-sm font-bold" style={{ color }}>{hood.score}</span>
                  </div>
                </div>

                <div className="p-7 space-y-5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-neutral-400 tracking-wider uppercase">
                      {hood.city}, {hood.state}
                    </span>
                    <span
                      className="text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 border"
                      style={{ color, borderColor: `${color}40`, backgroundColor: `${color}10` }}
                    >
                      {label}
                    </span>
                  </div>

                  <p className="text-neutral-500 text-xs leading-relaxed">{hood.description}</p>

                  <div className="space-y-3">
                    {Object.entries(hood.ratings).map(([key, val]) => (
                      <div key={key} className="flex items-center gap-3">
                        <span className="text-[9px] font-mono text-neutral-400 capitalize w-24 flex-shrink-0 tracking-wider">
                          {key}
                        </span>
                        <div className="flex-1">
                          <ScoreBar value={val} />
                        </div>
                        <span className="text-[9px] font-mono text-neutral-500 w-6 text-right">{val}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-dashed border-neutral-200">
                    <div>
                      <p className="text-[9px] font-mono text-neutral-400 uppercase tracking-wider mb-0.5">Avg. Rent</p>
                      <p className="font-mono text-xs font-bold text-neutral-900">
                        ₦{(hood.avgRentApartment / 1000000).toFixed(1)}M/yr
                      </p>
                    </div>
                    <Link
                      to={`/listings?neighbourhood=${encodeURIComponent(hood.name)}`}
                      className="inline-flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase text-amber-600 hover:text-amber-700 transition-colors group/link"
                    >
                      View listings
                      <span className="w-4 h-px bg-amber-600 transition-all group-hover/link:w-6" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-neutral-400 text-sm py-20">No areas found for this city.</p>
        )}
      </div>
    </main>
  );
}
