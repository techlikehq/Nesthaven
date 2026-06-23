import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router';
import { MapPin, TrendingUp, ArrowLeft, ArrowUpRight } from 'lucide-react';
import { neighbourhoods, getScoreLabel } from '../data/neighbourhoods';

function StatBar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1.5">
        <span className="font-serif text-xl font-semibold text-neutral-900 leading-none">{value}</span>
      </div>
      <div className="h-[2px] bg-neutral-200 w-full overflow-hidden mb-1.5">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${value}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="h-full bg-amber-600"
          style={{ opacity: 0.4 + (value / 100) * 0.6 }}
        />
      </div>
      <span className="text-[9px] font-mono text-neutral-400 uppercase tracking-wider">{label}</span>
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

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14">
          <div className="max-w-2xl space-y-4">
            <p className="text-amber-600 text-xs font-bold tracking-[0.25em] uppercase">
              // AREA INTELLIGENCE
            </p>
            <h1
              className="font-serif font-light text-neutral-900 leading-[1.1] tracking-tight"
              style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}
            >
              Know Before <br />
              <span className="font-serif italic text-neutral-700">You Move</span>
            </h1>
            <p className="text-neutral-500 text-sm max-w-xl leading-relaxed">
              Every area scored across security, infrastructure, flood risk, transport links, and amenities — so you move in with your eyes open.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {cities.map(c => (
              <button
                key={c}
                onClick={() => setCity(c)}
                className={`px-4 py-2.5 text-[10px] font-bold tracking-widest uppercase border transition-colors ${
                  city === c
                    ? 'bg-neutral-900 text-white border-neutral-900'
                    : 'bg-white text-neutral-500 border-neutral-300 hover:border-neutral-900'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((hood, i) => {
            const { label, color } = getScoreLabel(hood.score);
            return (
              <motion.div
                key={hood.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="group bg-white border border-neutral-200 hover:border-neutral-300 hover:shadow-xl hover:shadow-neutral-200/50 transition-all duration-300 overflow-hidden"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={hood.image}
                    alt={hood.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-neutral-950/20 to-transparent" />

                  {hood.trending && (
                    <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-600 text-white text-[9px] font-bold tracking-widest uppercase">
                      <TrendingUp size={9} /> Trending
                    </div>
                  )}

                  <div className="absolute top-4 right-4 w-14 h-14 rounded-full bg-[#F9F6F0]/95 backdrop-blur-sm flex flex-col items-center justify-center shadow-lg">
                    <span className="font-serif text-xl font-semibold text-neutral-900 leading-none">{hood.score}</span>
                    <span className="text-[7px] font-bold tracking-widest uppercase text-amber-700 mt-0.5">score</span>
                  </div>

                  <div className="absolute bottom-5 left-5 right-5">
                    <h3 className="font-serif text-2xl font-medium text-white leading-tight">{hood.name}</h3>
                    <p className="flex items-center gap-1.5 text-[11px] text-white/65 mt-1.5">
                      <MapPin size={10} /> {hood.city}, {hood.state}
                    </p>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between mb-6 pb-5 border-b border-dashed border-neutral-200">
                    <span
                      className="text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 border"
                      style={{ color, borderColor: `${color}40`, backgroundColor: `${color}0D` }}
                    >
                      {label}
                    </span>
                    <span className="text-[10px] font-mono text-neutral-400">Area Score</span>
                  </div>

                  <div className="grid grid-cols-5 gap-3 mb-6">
                    {Object.entries(hood.ratings).map(([key, val]) => (
                      <StatBar key={key} label={key.slice(0, 4)} value={val} />
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div>
                      <p className="text-[9px] font-mono text-neutral-400 uppercase tracking-wider">Avg. Rent</p>
                      <p className="font-mono text-base font-bold text-neutral-900 mt-0.5">
                        ₦{(hood.avgRentApartment / 1000000).toFixed(1)}M<span className="text-xs font-normal text-neutral-400">/yr</span>
                      </p>
                    </div>
                    <Link
                      to={`/listings?neighbourhood=${encodeURIComponent(hood.name)}`}
                      className="inline-flex items-center gap-2 px-4 py-3 bg-neutral-900 hover:bg-amber-600 text-white text-[10px] font-bold tracking-widest uppercase transition-colors duration-300"
                    >
                      View Listings <ArrowUpRight size={12} />
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
