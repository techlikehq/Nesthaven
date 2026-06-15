import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Search, MapPin, Home, ChevronDown, Shield, Star, Users } from 'lucide-react';
import { cities, listingTypes } from '../../data/properties';

const stats = [
  { icon: Home, value: 12000, suffix: '+', label: 'Verified Listings' },
  { icon: Users, value: 850, suffix: '+', label: 'Trusted Agents' },
  { icon: Star, value: 4.9, suffix: '/5', label: 'Avg. Rating' },
  { icon: Shield, value: 100, suffix: '%', label: 'Scam Protected' },
];

// Reusable Count-Up Component matching the crisp numbers layout
function CountingNumber({ value, suffix, duration = 2000 }: { value: number; suffix: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const elementRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const startValue = value > 1000 ? value - 200 : 0;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      const easeProgress = progress * (2 - progress);
      const currentValue = easeProgress * (value - startValue) + startValue;

      if (Number.isInteger(value)) {
        setCount(Math.floor(currentValue));
      } else {
        setCount(parseFloat(currentValue.toFixed(1)));
      }

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setCount(value);
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          window.requestAnimationFrame(step);
          observer.disconnect();
        }
      },
      { threshold: 0.05, rootMargin: '0px 0px 50px 0px' }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [value, duration]);

  return (
    <span ref={elementRef} className="tabular-nums">
      {Number.isInteger(value) ? count.toLocaleString() : count.toFixed(1)}
      {suffix}
    </span>
  );
}

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
    <section className="relative min-h-screen flex flex-col justify-end pb-20 overflow-hidden">
      
      {/* Background with Atmospheric Pulsing Breath Motion
        The lush green backdrop image and its specific gradient dark overlay
        are preserved, but now execute a swift, continuous kinetic loop.
      */}
      <div className="absolute inset-0 select-none pointer-events-none overflow-hidden">
        <motion.img
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=80"
          alt="Nigerian home backdrop"
          animate={{
            scale: [1.02, 1.12, 1.05, 1.02],
            x: [0, -25, 20, 0],
            // Organically sways the landscape, creating premium organic weight unlike linear card panning.
            rotate: [0, 0.5, -0.5, 0]
          }}
          transition={{
            duration: 6, // Snappy momentum speed loop (6 seconds)
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "mirror"
          }}
          className="w-full h-full object-cover origin-center transform"
        />
        
        {/* Original specific gradient overlay preserving depth and lighting of image_0.png */}
        <div className="absolute inset-0 bg-gradient-to-b from-forest-900/70 via-forest-900/60 to-forest-900/90" />
        <div className="absolute inset-0 bg-gradient-to-r from-forest-900/40 to-transparent" />
      </div>

      {/* Foreground Content - All elements are structurally preserved */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 w-full">

        {/* Badge - Structurally preserved */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-white/90 text-sm mb-8"
        >
          <Shield size={14} className="text-brand-400" />
          Nigeria's most trust-focused real estate platform
        </motion.div>

        {/* Headline with Huge Typography Contrast - Structurally preserved */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.19, 1, 0.22, 1] }}
          className="font-display font-semibold text-white leading-[0.85] tracking-tighter mb-8"
          style={{ fontSize: 'clamp(3.5rem, 8.5vw, 7.5rem)' }}
        >
          Find Your Perfect<br />
          <span className="text-amber-400 font-light">Home in Nigeria</span>
        </motion.h1>

        {/* Paragraph text - Structurally preserved */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="text-white/70 text-lg max-w-xl mb-12 leading-relaxed"
        >
          Verified listings. Trusted agents. Anti-scam protection built in.
          Move in with complete confidence.
        </motion.p>

        {/* Search Box Console - Structurally preserved */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.45 }}
          className="bg-white rounded-2xl shadow-2xl p-2 max-w-3xl mb-8"
        >
          {/* Type Tabs */}
          <div className="flex gap-1 mb-2 px-2 pt-1">
            {listingTypes.map(type => (
              <button
                key={type}
                onClick={() => setListingType(type as typeof listingType)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  listingType === type
                    ? 'bg-brand-700 text-white'
                    : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Search Inputs */}
          <div className="flex flex-col sm:flex-row gap-2 p-2 pt-1">
            {/* Location */}
            <div className="relative flex-shrink-0">
              <MapPin size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <select
                value={city}
                onChange={e => setCity(e.target.value)}
                className="pl-8 pr-8 py-3 bg-gray-50 rounded-xl text-sm text-gray-700 font-medium border-none outline-none appearance-none cursor-pointer min-w-[160px] w-full sm:w-auto"
              >
                {cities.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>

            {/* Divider */}
            <div className="hidden sm:block w-px bg-gray-200 self-stretch my-1" />

            {/* Keyword */}
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Neighbourhood, street, or area..."
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={handleKey}
                className="w-full pl-9 pr-4 py-3 bg-transparent text-sm text-gray-800 placeholder:text-gray-400 outline-none"
              />
            </div>

            {/* CTA */}
            <button
              onClick={handleSearch}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-brand-700 hover:bg-brand-800 text-white rounded-xl text-sm font-semibold transition-all shadow-sm hover:shadow-md active:scale-95"
            >
              <Search size={15} />
              Search Index
            </button>
          </div>
        </motion.div>

        {/* Popular Searches Tags - Structurally preserved */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.65 }}
          className="flex flex-wrap items-center gap-2 mb-16"
        >
          <span className="text-white/50 text-xs">Popular:</span>
          {['GRA Phase 2 PHC', 'Lekki Lagos', 'Maitama Abuja', '3 Bedroom Flat', 'Furnished'].map(tag => (
            <button
              key={tag}
              onClick={() => { setQuery(tag); setTimeout(handleSearch, 0); }}
              className="px-3 py-1 bg-white/10 hover:bg-white/20 border border-white/15 rounded-full text-white/70 text-xs transition-all"
            >
              {tag}
            </button>
          ))}
        </motion.div>

        {/* Stark Asymmetrical Motion Stats Layout - Structurally preserved */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.75 }}
          className="w-full max-w-4xl mx-auto flex flex-col gap-12 pt-8 border-t border-white/10"
        >
          {stats.map(({ value, suffix, label }, index) => (
            <div key={label} className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-12 items-center">
              {/* Left Column: Vertical Form Metrics borderless/backgroundless with animated line indication */}
              <div className="relative flex flex-col items-start md:items-end justify-between pr-0 md:pr-12 pl-4 md:pl-0 pb-1 md:pb-0">
                
                {/* Animated Line Indicator */}
                <motion.div 
                  initial={{ scaleY: 0 }}
                  whileInView={{ scaleY: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.15, ease: 'easeInOut' }}
                  className="absolute left-0 md:left-auto md:right-0 top-0 bottom-0 w-[3px] bg-amber-400 origin-top"
                />

                <div className="flex items-baseline tracking-tighter text-white font-display font-medium leading-[0.8] text-[5.5rem]">
                  <CountingNumber value={value} suffix={suffix} duration={1200 + index * 200} />
                </div>
                <span className="text-[10px] font-bold text-white/40 mt-3 uppercase tracking-widest">
                  {label}
                </span>
              </div>

              {/* Right Column: Descriptions aligned past the sharp dividing layout crosshair */}
              <div className="flex items-center max-w-[320px] pl-2 md:pl-0">
                <p className="text-sm text-white/70 leading-relaxed font-normal">
                  Our current milestone of active {label.toLowerCase()} across our platform ecosystem.
                </p>
              </div>
            </div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}