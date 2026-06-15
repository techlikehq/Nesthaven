import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router';
import { MapPin, TrendingUp, ArrowRight } from 'lucide-react';
import { neighbourhoods, getScoreLabel } from '../../data/neighbourhoods';

function ScoreBar({ value }: { value: number }) {
  return (
    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        whileInView={{ width: `${value}%` }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className={`h-full rounded-full ${value >= 90 ? 'bg-green-500' : value >= 75 ? 'bg-amber-500' : 'bg-orange-500'}`}
      />
    </div>
  );
}

export default function NeighbourhoodSection() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14">
          <div>
            <p className="text-brand-600 text-sm font-semibold tracking-widest uppercase mb-3">Area Intelligence</p>
            <h2 className="font-display font-semibold text-ink-900 leading-tight"
                style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
              Know Before You Move
            </h2>
            <p className="text-gray-500 text-sm mt-2 max-w-md">
              Our proprietary scoring ranks every neighbourhood on security, infrastructure, flooding risk, transport and amenities.
            </p>
          </div>
          <Link to="/areas" className="flex items-center gap-2 text-brand-700 font-semibold text-sm hover:gap-3 transition-all">
            View All Areas <ArrowRight size={15} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {neighbourhoods.map((hood, i) => {
            const { label, color } = getScoreLabel(hood.score);
            return (
              <motion.div
                key={hood.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="group bg-cream-100 hover:bg-white rounded-2xl border border-gray-100 hover:border-brand-100 hover:shadow-lg transition-all duration-300 overflow-hidden"
              >
                {/* Image strip */}
                <div className="relative h-32 overflow-hidden">
                  <img
                    src={hood.image}
                    alt={hood.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-3 left-4 flex items-center gap-2">
                    <span className="flex items-center gap-1 text-white font-semibold text-sm">
                      <MapPin size={12} /> {hood.name}
                    </span>
                    {hood.trending && (
                      <span className="flex items-center gap-1 px-2 py-0.5 bg-amber-500 rounded-full text-white text-[10px] font-semibold">
                        <TrendingUp size={9} /> Hot
                      </span>
                    )}
                  </div>
                  {/* Score badge */}
                  <div className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-md">
                    <span className="font-mono-custom font-bold text-sm" style={{ color }}>{hood.score}</span>
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-gray-400">{hood.city}, {hood.state}</span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ color, backgroundColor: `${color}18` }}>
                      {label}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    {Object.entries(hood.ratings).map(([key, val]) => (
                      <div key={key} className="flex items-center gap-3">
                        <span className="text-[10px] text-gray-400 capitalize w-24 flex-shrink-0">{key}</span>
                        <div className="flex-1"><ScoreBar value={val} /></div>
                        <span className="text-[10px] font-mono-custom text-gray-500 w-7 text-right">{val}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div>
                      <p className="text-[10px] text-gray-400">Avg. Rent</p>
                      <p className="font-mono-custom text-xs font-semibold text-brand-700">
                        ₦{(hood.avgRentApartment / 1000000).toFixed(1)}M/yr
                      </p>
                    </div>
                    <Link
                      to={`/listings?neighbourhood=${encodeURIComponent(hood.name)}`}
                      className="text-xs text-brand-700 font-semibold hover:underline"
                    >
                      View listings →
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
