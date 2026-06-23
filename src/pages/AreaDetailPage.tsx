import React from 'react';
import { useParams, Link } from 'react-router';
import { motion } from 'motion/react';
import {
  ArrowLeft, MapPin, TrendingUp, Droplets, Zap, ShieldCheck,
  AlertTriangle, FileCheck, Waves, Route, ArrowUpRight,
} from 'lucide-react';
import { neighbourhoods, getScoreLabel } from '../data/neighbourhoods';
import { properties } from '../data/properties';
import PropertyCard from '../components/properties/PropertyCard';

const slugify = (name: string) => name.toLowerCase().replace(/[\s/]+/g, '-');

function StatBlock({ icon: Icon, label, value }: { icon: any; label: string; value: number }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <Icon size={14} className="text-amber-600" strokeWidth={1.8} />
        <span className="text-[11px] font-bold tracking-widest uppercase text-neutral-500">{label}</span>
      </div>
      <div className="flex items-baseline gap-2 mb-1.5">
        <span className="font-serif text-3xl font-semibold text-neutral-900">{value}</span>
        <span className="text-xs text-neutral-400">/ 100</span>
      </div>
      <div className="h-[3px] bg-neutral-100 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="h-full bg-amber-600"
          style={{ opacity: 0.45 + (value / 100) * 0.55 }}
        />
      </div>
    </div>
  );
}

export default function AreaDetailPage() {
  const { slug } = useParams();
  const hood = neighbourhoods.find(h => slugify(h.name) === slug);

  if (!hood) {
    return (
      <main className="bg-[#F9F6F0] min-h-screen pt-28 pb-24 flex items-center justify-center">
        <div className="text-center px-6">
          <h1 className="font-serif text-3xl text-neutral-900 mb-3">Area Not Found</h1>
          <p className="text-neutral-500 text-sm mb-8">This neighbourhood report doesn't exist or the link is incorrect.</p>
          <Link to="/areas" className="inline-flex items-center gap-3 text-xs font-bold tracking-widest uppercase text-white bg-neutral-900 hover:bg-amber-600 px-6 py-3.5 transition-colors">
            Browse All Areas
          </Link>
        </div>
      </main>
    );
  }

  const { label, color } = getScoreLabel(hood.score);
  const { intelligence: intel } = hood;
  const areaListings = properties.filter(p => p.neighbourhood === hood.name);

  return (
    <main className="bg-[#F9F6F0] min-h-screen pb-24">

      <div className="relative h-[50vh] min-h-[380px] overflow-hidden">
        <img src={hood.image} alt={hood.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-neutral-950/30 to-neutral-950/10" />

        <div className="absolute top-6 left-6">
          <Link to="/areas" className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-white/80 hover:text-amber-400 transition-colors">
            <ArrowLeft size={14} /> Back to Areas
          </Link>
        </div>

        {hood.trending && (
          <div className="absolute top-6 right-6 inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 text-white text-[10px] font-bold tracking-widest uppercase">
            <TrendingUp size={10} /> Trending
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 w-full">
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="flex items-center gap-1.5 text-sm text-white/70 mb-2">
                <MapPin size={13} /> {hood.city}, {hood.state}
              </p>
              <h1 className="font-serif text-5xl font-light text-white">{hood.name}</h1>
            </div>
            <div className="shrink-0 w-20 h-20 rounded-full bg-[#F9F6F0]/95 backdrop-blur-sm flex flex-col items-center justify-center shadow-xl">
              <span className="font-serif text-3xl font-bold text-neutral-900 leading-none">{hood.score}</span>
              <span className="text-[8px] font-bold tracking-widest uppercase text-amber-700 mt-1">score</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">

        <div className="flex items-center gap-3 mb-10">
          <span
            className="text-[11px] font-bold tracking-widest uppercase px-3 py-1.5 border"
            style={{ color, borderColor: `${color}40`, backgroundColor: `${color}0D` }}
          >
            {label}
          </span>
          <p className="text-neutral-500 text-sm">{hood.description}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

          <div className="lg:col-span-8 space-y-10">

            <div>
              <h2 className="font-sans font-black text-neutral-900 text-xs tracking-wider uppercase mb-6">Neighbourhood Intelligence</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6 bg-white border border-neutral-200 p-7">
                <StatBlock icon={Droplets} label="Drainage" value={intel.drainage} />
                <StatBlock icon={ShieldCheck} label="Security" value={hood.ratings.security} />
                <StatBlock icon={Route} label="Road Network" value={hood.ratings.transport} />
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Zap size={14} className="text-amber-600" strokeWidth={1.8} />
                    <span className="text-[11px] font-bold tracking-widest uppercase text-neutral-500">Power</span>
                  </div>
                  <div className="flex items-baseline gap-2 mb-1.5">
                    <span className="font-serif text-3xl font-semibold text-neutral-900">{intel.powerHoursPerDay}</span>
                  </div>
                  <div className="h-[3px] bg-neutral-100 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${intel.powerScore}%` }}
                      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                      className="h-full bg-amber-600"
                      style={{ opacity: 0.45 + (intel.powerScore / 100) * 0.55 }}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-4">
                {intel.floodRisk ? (
                  <span className="inline-flex items-center justify-center gap-2 text-xs font-bold text-orange-700 bg-orange-50 border border-orange-200 px-4 py-3">
                    <AlertTriangle size={13} /> Flood Risk
                  </span>
                ) : (
                  <span className="inline-flex items-center justify-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-4 py-3">
                    <Waves size={13} /> No Flooding
                  </span>
                )}
                {intel.cOfO ? (
                  <span className="inline-flex items-center justify-center gap-2 text-xs font-bold text-neutral-700 bg-white border border-neutral-200 px-4 py-3">
                    <FileCheck size={13} /> C of O Common
                  </span>
                ) : (
                  <span className="inline-flex items-center justify-center gap-2 text-xs font-bold text-neutral-400 bg-white border border-neutral-200 px-4 py-3">
                    <FileCheck size={13} /> C of O Less Common
                  </span>
                )}
              </div>
            </div>

            <div>
              <h2 className="font-sans font-black text-neutral-900 text-xs tracking-wider uppercase mb-4 flex items-center gap-2">
                <Droplets size={14} className="text-sky-500" /> Water Supply
              </h2>
              <div className="bg-white border border-neutral-200 p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-neutral-900">{intel.waterSupply.source}</span>
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      {[0, 1, 2, 3].map(i => (
                        <span key={i} className={`w-2 h-2 rounded-full ${i < intel.waterSupply.quality ? 'bg-sky-500' : 'bg-neutral-200'}`} />
                      ))}
                    </div>
                    <span className="text-xs font-bold text-sky-600">{intel.waterSupply.label}</span>
                  </div>
                </div>
                <p className="text-sm text-neutral-600 leading-relaxed">{intel.waterSupply.note}</p>
              </div>
            </div>

            <div>
              <h2 className="font-sans font-black text-neutral-900 text-xs tracking-wider uppercase mb-4">Other Ratings</h2>
              <div className="grid grid-cols-2 gap-x-8 gap-y-5 bg-white border border-neutral-200 p-6">
                <StatBlock icon={ShieldCheck} label="Infrastructure" value={hood.ratings.infrastructure} />
                <StatBlock icon={ShieldCheck} label="Amenities" value={hood.ratings.amenities} />
              </div>
            </div>

            {areaListings.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-sans font-black text-neutral-900 text-xs tracking-wider uppercase">
                    Listings in {hood.name}
                  </h2>
                  <Link
                    to={`/listings?neighbourhood=${encodeURIComponent(hood.name)}`}
                    className="text-xs text-amber-600 font-semibold hover:underline"
                  >
                    View all →
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {areaListings.map((p, i) => (
                    <PropertyCard key={p.id} property={p} index={i} />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-4">
            <div className="sticky top-24 bg-white border border-neutral-200 p-6">
              <p className="text-[10px] font-bold tracking-widest uppercase text-neutral-400 mb-1">Avg. Rent (Apartment)</p>
              <p className="font-mono text-2xl font-bold text-neutral-900 mb-5">
                ₦{(hood.avgRentApartment / 1000000).toFixed(1)}M<span className="text-sm font-normal text-neutral-400">/yr</span>
              </p>
              <p className="text-[10px] font-bold tracking-widest uppercase text-neutral-400 mb-1">Avg. Sale Price</p>
              <p className="font-mono text-2xl font-bold text-neutral-900 mb-6">
                ₦{(hood.avgSalePrice / 1000000).toFixed(0)}M
              </p>
              <Link
                to={`/listings?neighbourhood=${encodeURIComponent(hood.name)}`}
                className="flex items-center justify-center gap-2 w-full py-3.5 bg-neutral-900 hover:bg-amber-600 text-white text-xs font-bold tracking-widest uppercase transition-colors"
              >
                View Listings <ArrowUpRight size={13} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
