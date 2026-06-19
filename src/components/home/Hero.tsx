import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Search, MapPin, Home, ChevronDown, Shield, Star, Users } from 'lucide-react';
import { cities, listingTypes } from '../../data/properties';

// ── Stats with descriptions ───────────────────────────────────────────────────
const stats = [
{
icon: Home,
value: 50,
suffix: '+',
label: 'Verified Listings',
desc: 'Every property is reviewed before it goes live. No fake listings, ever.',
},
{
icon: Users,
value: 25,
suffix: '+',
label: 'Trusted Agents',
desc: 'Agents are ID-verified and document-checked before they can list.',
},
{
icon: Star,
value: 5.0,
suffix: '/5',
label: 'Avg. Rating',
desc: 'Early users rate their NestHaven experience consistently at the top.',
},
{
icon: Shield,
value: 100,
suffix: '%',
label: 'Scam Protected',
desc: 'Your money is held in escrow until you inspect and approve the property.',
},
];

// ── Count-up ──────────────────────────────────────────────────────────────────
function CountingNumber({
value,
suffix,
duration = 3000,
}: {
value: number;
suffix: string;
duration?: number;
}) {
const [count, setCount] = useState(0);
const ref = useRef<HTMLSpanElement>(null);

useEffect(() => {
let startTs: number | null = null;
const isInt = Number.isInteger(value);
const from = value > 10 ? value - Math.min(value * 0.4, 30) : 0;

const tick = (ts: number) => {
if (!startTs) startTs = ts;
const p = Math.min((ts - startTs) / duration, 1);
const eased = p * (2 - p);
const cur = eased * (value - from) + from;
setCount(isInt ? Math.floor(cur) : parseFloat(cur.toFixed(1)));
if (p < 1) requestAnimationFrame(tick);
else setCount(value);
};

const observer = new IntersectionObserver(
([entry]) => {
if (entry.isIntersecting) {
requestAnimationFrame(tick);
observer.disconnect();
}
},
{ threshold: 0.1 }
);
if (ref.current) observer.observe(ref.current);
return () => observer.disconnect();
}, [value, duration]);

return (
<span ref={ref} className="tabular-nums">
{Number.isInteger(value) ? count.toLocaleString() : count.toFixed(1)}
{suffix}
</span>
);
}

// ── Hero ──────────────────────────────────────────────────────────────────────
export default function Hero() {
const navigate = useNavigate();
const [listingType, setListingType] = useState<'Rent' | 'Sale' | 'Shortlet'>('Rent');
const [city, setCity] = useState('All Cities');
const [query, setQuery] = useState('');

const handleSearch = () => {
const params = new URLSearchParams();
if (query) params.set('q', query);
if (city !== 'All Cities') params.set('city', city);
params.set('type', listingType);
navigate(`/listings?${params.toString()}`);
};

const handleKey = (e: React.KeyboardEvent) => {
if (e.key === 'Enter') handleSearch();
};

return (
<section className="relative min-h-screen flex flex-col overflow-hidden">

{/* ── Background ── */}
<div className="absolute inset-0 select-none pointer-events-none overflow-hidden">
<motion.img
src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=80"
alt="Nigerian home backdrop"
animate={{ scale: [1, 1.06] }}
transition={{ duration: 14, ease: 'easeInOut', repeat: Infinity, repeatType: 'mirror' }}
className="w-full h-full object-cover origin-center"
/>
<div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/30 to-transparent" />
<div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/25" />
</div>

{/* ── Main content ── */}
<div className="relative z-10 flex-1 flex flex-col justify-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-8 w-full">

{/* Badge */}
<motion.div
initial={{ opacity: 0, y: 16 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.5, delay: 0.1 }}
className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-white/85 text-sm mb-8 w-fit"
>
<Shield size={13} className="text-amber-400" />
Port Harcourt's first verified real estate platform
</motion.div>

{/* Headline */}
<motion.h1
initial={{ opacity: 0, y: 24 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.7, delay: 0.2, ease: [0.19, 1, 0.22, 1] }}
className="font-display font-bold text-white leading-[0.9] tracking-tighter mb-6"
style={{ fontSize: 'clamp(3rem, 7.5vw, 6.5rem)' }}
>
Find a home<br />
<span className="text-amber-400 font-light italic">you can trust.</span>
</motion.h1>

{/* Subtext */}
<motion.p
initial={{ opacity: 0, y: 16 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.6, delay: 0.32 }}
className="text-white/65 text-base sm:text-lg max-w-lg mb-10 leading-relaxed"
>
House hunting in Nigeria shouldn't feel like a gamble.
NestHaven connects you to verified agents in Port Harcourt
and protects your money until you've seen the property yourself.
</motion.p>

{/* Search Box */}
<motion.div
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.6, delay: 0.42 }}
className="bg-white rounded-2xl shadow-2xl p-2 max-w-2xl mb-6"
>
<div className="flex gap-1 mb-2 px-2 pt-1">
{(listingTypes as string[]).map(type => (
<button
key={type}
onClick={() => setListingType(type as typeof listingType)}
className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
listingType === type
? 'bg-green-800 text-white'
: 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
}`}
>
{type}
</button>
))}
</div>

<div className="flex flex-col sm:flex-row gap-2 p-2 pt-1">
<div className="relative flex-shrink-0">
<MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
<select
value={city}
onChange={e => setCity(e.target.value)}
className="pl-8 pr-8 py-3 bg-gray-50 rounded-xl text-sm text-gray-700 font-medium border-none outline-none appearance-none cursor-pointer min-w-[150px] w-full sm:w-auto"
>
{cities.map(c => <option key={c} value={c}>{c}</option>)}
</select>
<ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
</div>

<div className="hidden sm:block w-px bg-gray-200 self-stretch my-1" />

<div className="relative flex-1">
<Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
<input
type="text"
placeholder="Neighbourhood, street, or area..."
value={query}
onChange={e => setQuery(e.target.value)}
onKeyDown={handleKey}
className="w-full pl-9 pr-4 py-3 bg-transparent text-sm text-gray-800 placeholder:text-gray-400 outline-none"
/>
</div>

<button
onClick={handleSearch}
className="flex items-center justify-center gap-2 px-6 py-3 bg-green-800 hover:bg-green-900 text-white rounded-xl text-sm font-semibold transition-all shadow-sm hover:shadow-md active:scale-95"
>
<Search size={14} />
Search
</button>
</div>
</motion.div>

{/* Popular tags */}
<motion.div
initial={{ opacity: 0 }}
animate={{ opacity: 1 }}
transition={{ duration: 0.5, delay: 0.58 }}
className="flex flex-wrap items-center gap-2"
>
<span className="text-white/40 text-xs">Popular:</span>
{['GRA Phase 2 PHC', 'Trans Amadi', 'Rumuola', '3 Bedroom Flat', 'Self Contain'].map(tag => (
<button
key={tag}
onClick={() => { setQuery(tag); setTimeout(handleSearch, 0); }}
className="px-3 py-1 bg-white/10 hover:bg-white/20 border border-white/15 rounded-full text-white/65 text-xs transition-all"
>
{tag}
</button>
))}
</motion.div>
</div>

{/* ── Stats strip — horizontal 4 columns with descriptions ── */}
<motion.div
initial={{ opacity: 0, y: 24 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.7, delay: 0.9 }}
className="relative z-10 w-full"
>
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
<div className="grid grid-cols-2 lg:grid-cols-4 border border-white/15 rounded-2xl overflow-hidden">
{stats.map(({ icon: Icon, value, suffix, label, desc }, i) => (
<motion.div
key={label}
initial={{ opacity: 0, y: 12 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.5, delay: 1.0 + i * 0.12 }}
className={`
relative flex flex-col gap-3 px-8 py-8
bg-transparent
hover:bg-white/5 transition-colors duration-200
${i < 3 ? 'border-r border-white/15' : ''}
${i < 2 ? 'border-b border-white/15 lg:border-b-0' : ''}
`}
>
{/* Amber left accent line */}
<motion.div
initial={{ scaleY: 0, opacity:0 }}
animate={{ scaleY: [0, 1, 1, 0], opacity: [0,1,1,0] }}
transition={{ duration: 2.5, delay: i * 0.3, repeat: Infinity,repeatDelay: 1, ease: 'easeInOut' }}
className="absolute left-0 top-8 bottom-8 w-px bg-amber-300 origin-top"
/>

{/* Icon + number row */}
<div className="flex items-center gap-3">
<Icon size={14} className="text-amber-400 flex-shrink-0" />
<span
className="font-display font-bold text-white drop-shadow-lg leading-none tracking-tight"
style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)' }}
>
<CountingNumber value={value} suffix={suffix} duration={3000 + i * 400} />
</span>
</div>

{/* Label */}
<div className="text-[10px] font-bold uppercase tracking-widest text-white/80">
{label}
</div>

{/* Description */}
<p className="text-white/90 text-xs leading-relaxed drop-shadow-sm">
{desc}
</p>
</motion.div>
))}
</div>
</div>
</motion.div>

</section>
);
}
