
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router';
import { MapPin, TrendingUp, ArrowRight, ArrowUpRight, Shield, Zap, Droplets, Bus, Star } from 'lucide-react';
import { neighbourhoods, getScoreLabel } from '../../data/neighbourhoods';

// ── Score bar — refined, minimal ─────────────────────────────────────────────
function ScoreBar({ value, delay = 0 }: { value: number; delay?: number }) {
const color = value >= 90 ? '#16a34a' : value >= 75 ? '#d97706' : '#ea580c';
return (
<div className="h-[3px] bg-gray-100 rounded-full overflow-hidden">
<motion.div
initial={{ width: 0 }}
whileInView={{ width: `${value}%` }}
viewport={{ once: true }}
transition={{ duration: 1.1, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
style={{ backgroundColor: color }}
className="h-full rounded-full"
/>
</div>
);
}

// ── Rating icon map ──────────────────────────────────────────────────────────
const ratingIcons: Record<string, React.ReactNode> = {
security: <Shield size={10} />,
infrastructure: <Zap size={10} />,
flooding: <Droplets size={10} />,
transport: <Bus size={10} />,
amenities: <Star size={10} />,
};

// ── Score ring ───────────────────────────────────────────────────────────────
function ScoreRing({ score, color }: { score: number; color: string }) {
const r = 18;
const circ = 2 * Math.PI * r;
const offset = circ - (score / 100) * circ;
return (
<div className="relative w-14 h-14 flex items-center justify-center">
<svg width="56" height="56" className="-rotate-90 absolute inset-0">
<circle cx="28" cy="28" r={r} fill="none" stroke="#f3f4f6" strokeWidth="3" />
<motion.circle
cx="28" cy="28" r={r}
fill="none"
stroke={color}
strokeWidth="3"
strokeLinecap="round"
strokeDasharray={circ}
initial={{ strokeDashoffset: circ }}
whileInView={{ strokeDashoffset: offset }}
viewport={{ once: true }}
transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
/>
</svg>
<span className="relative font-bold text-sm" style={{ color }}>{score}</span>
</div>
);
}

// ── Main card ────────────────────────────────────────────────────────────────
function NeighbourhoodCard({ hood, index }: { hood: any; index: number }) {
const { label, color } = getScoreLabel(hood.score);
const ratings = Object.entries(hood.ratings) as [string, number][];

return (
<motion.div
initial={{ opacity: 0, y: 28 }}
whileInView={{ opacity: 1, y: 0 }}
viewport={{ once: true, margin: '-40px' }}
transition={{ duration: 0.55, delay: index * 0.07, ease: [0.25, 0.46, 0.45, 0.94] }}
className="group relative bg-white rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-[0_8px_40px_rgba(0,0,0,0.08)] transition-all duration-400 overflow-hidden flex flex-col"
>
{/* ── Image ── */}
<div className="relative h-44 overflow-hidden flex-shrink-0">
<img
src={hood.image}
alt={hood.name}
className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
/>
{/* Gradient */}
<div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

{/* Top row — trending badge + score ring */}
<div className="absolute top-3 left-3 right-3 flex items-start justify-between">
{hood.trending ? (
<span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-500 rounded-full text-white text-[10px] font-bold uppercase tracking-wider">
<TrendingUp size={9} /> Hot
</span>
) : (
<div />
)}
<div className="bg-white rounded-full shadow-md p-0.5">
<ScoreRing score={hood.score} color={color} />
</div>
</div>

{/* Bottom — name + location */}
<div className="absolute bottom-0 left-0 right-0 px-4 pb-4">
<h3 className="font-display font-bold text-white text-lg leading-tight tracking-tight">
{hood.name}
</h3>
<div className="flex items-center gap-1 mt-0.5">
<MapPin size={10} className="text-white/60" />
<span className="text-white/60 text-[10px]">{hood.city}, {hood.state}</span>
</div>
</div>
</div>

{/* ── Body ── */}
<div className="flex flex-col flex-1 p-5">

{/* Status label */}
<div className="flex items-center justify-between mb-4">
<span
className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
style={{ color, backgroundColor: `${color}15` }}
>
{label}
</span>
<span className="text-[10px] text-gray-400 font-medium">Area Score</span>
</div>

{/* Ratings */}
<div className="space-y-2.5 mb-5 flex-1">
{ratings.map(([key, val], ri) => (
<div key={key} className="grid grid-cols-[20px_1fr_28px] items-center gap-2.5">
<span className="text-gray-300 flex justify-center">
{ratingIcons[key] ?? <span className="w-2 h-2 rounded-full bg-gray-200 inline-block" />}
</span>
<ScoreBar value={val} delay={ri * 0.1} />
<span className="text-[10px] font-mono text-gray-400 text-right">{val}</span>
</div>
))}
</div>

{/* Footer */}
<div className="flex items-center justify-between pt-4 border-t border-gray-50">
<div>
<p className="text-[9px] uppercase tracking-widest text-gray-400 mb-0.5">Avg. Rent</p>
<p className="text-sm font-bold text-gray-900">
₦{(hood.avgRentApartment / 1_000_000).toFixed(1)}M
<span className="text-xs font-normal text-gray-400">/yr</span>
</p>
</div>
<Link
to={`/listings?neighbourhood=${encodeURIComponent(hood.name)}`}
className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-gray-900 hover:bg-green-800 px-3 py-2 rounded-lg transition-colors duration-200"
>
View listings
<ArrowUpRight size={11} />
</Link>
</div>
</div>
</motion.div>
);
}

// ── Section ──────────────────────────────────────────────────────────────────
export default function NeighbourhoodSection() {
const [filter, setFilter] = useState<'all' | 'hot'>('all');

const displayed = filter === 'hot'
? neighbourhoods.filter(h => h.trending)
: neighbourhoods;

return (
<section className="py-28 bg-[#F9F8F6]">
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

{/* ── Header ── */}
<div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-14">
<div className="max-w-xl">

{/* Eyebrow */}
<div className="inline-flex items-center gap-2 mb-4">
<div className="w-5 h-px bg-green-700" />
<span className="text-[10px] font-bold uppercase tracking-[0.2em] text-green-700">
Area Intelligence
</span>
</div>

<h2
className="font-display font-bold text-gray-900 leading-[1.0] tracking-tight mb-4"
style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.5rem)' }}
>
Know your neighbourhood<br />
<span className="text-green-700">before you move in.</span>
</h2>

<p className="text-gray-500 text-sm leading-relaxed max-w-md">
Every area in Port Harcourt scored across security, infrastructure,
flood risk, transport links, and amenities — so you move in with
your eyes open.
</p>
</div>

{/* Controls */}
<div className="flex items-center gap-3 flex-shrink-0">
{/* Filter pills */}
<div className="flex items-center bg-white border border-gray-100 rounded-xl p-1 gap-1">
{(['all', 'hot'] as const).map(f => (
<button
key={f}
onClick={() => setFilter(f)}
className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
filter === f
? 'bg-gray-900 text-white shadow-sm'
: 'text-gray-500 hover:text-gray-800'
}`}
>
{f === 'all' ? 'All Areas' : '🔥 Trending'}
</button>
))}
</div>

<Link
to="/areas"
className="inline-flex items-center gap-2 text-xs font-semibold text-gray-900 border border-gray-200 hover:border-gray-900 px-4 py-2.5 rounded-xl transition-all duration-200 hover:gap-3"
>
View all <ArrowRight size={13} />
</Link>
</div>
</div>

{/* ── Grid ── */}
<AnimatePresence mode="wait">
<motion.div
key={filter}
initial={{ opacity: 0 }}
animate={{ opacity: 1 }}
exit={{ opacity: 0 }}
transition={{ duration: 0.25 }}
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
>
{displayed.map((hood, i) => (
<NeighbourhoodCard key={hood.id} hood={hood} index={i} />
))}
</motion.div>
</AnimatePresence>

{/* ── Bottom CTA ── */}
<motion.div
initial={{ opacity: 0, y: 16 }}
whileInView={{ opacity: 1, y: 0 }}
viewport={{ once: true }}
transition={{ duration: 0.5, delay: 0.2 }}
className="mt-14 flex flex-col sm:flex-row items-center justify-between gap-6 p-8 bg-white rounded-2xl border border-gray-100"
>
<div>
<p className="font-display font-bold text-gray-900 text-lg mb-1">
Ready to find your dream home?
</p>
<p className="text-gray-500 text-sm">
Contact us for expert insights to any area in Port Harcourt.
</p>
</div>
<div className="flex items-center gap-3 flex-shrink-0">
<Link
to="/areas"
className="text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors"
>
Explore Areas
</Link>
<Link
to="/contact"
className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-800 hover:bg-green-900 text-white text-sm font-semibold rounded-xl transition-colors duration-200"
>
Contact Sales
<ArrowUpRight size={14} />
</Link>
</div>
</motion.div>

</div>
</section>
);
}

