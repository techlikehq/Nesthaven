import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { SlidersHorizontal, X, Search, Grid3X3, List, MapPin } from 'lucide-react';
import { properties, cities, propertyTypes, listingTypes, type ListingType, type PropertyType } from '../data/properties';
import PropertyCard from '../components/properties/PropertyCard';

const priceRanges = [
  { label: 'Any', min: 0, max: Infinity },
  { label: 'Under ₦1M', min: 0, max: 1000000 },
  { label: '₦1M – ₦3M', min: 1000000, max: 3000000 },
  { label: '₦3M – ₦8M', min: 3000000, max: 8000000 },
  { label: '₦8M – ₦20M', min: 8000000, max: 20000000 },
  { label: 'Above ₦20M', min: 20000000, max: Infinity },
];

const bedroomOptions = ['Any', '1', '2', '3', '4', '5+'];

export default function ListingsPage() {
  const [searchParams] = useSearchParams();

  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [city, setCity] = useState(searchParams.get('city') || 'All Cities');
  const [type, setType] = useState<ListingType | 'All'>((searchParams.get('type') as ListingType) || 'All');
  const [propType, setPropType] = useState<PropertyType | 'All'>('All');
  const [priceRange, setPriceRange] = useState(priceRanges[0]);
  const [bedrooms, setBedrooms] = useState('Any');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [mobileFilter, setMobileFilter] = useState(false);

  const filtered = useMemo(() => {
    return properties.filter(p => {
      if (query && !p.title.toLowerCase().includes(query.toLowerCase()) &&
          !p.neighbourhood.toLowerCase().includes(query.toLowerCase()) &&
          !p.city.toLowerCase().includes(query.toLowerCase())) return false;
      if (city !== 'All Cities' && p.city !== city) return false;
      if (type !== 'All' && p.listingType !== type) return false;
      if (propType !== 'All' && p.propertyType !== propType) return false;
      if (p.price < priceRange.min || p.price > priceRange.max) return false;
      if (bedrooms !== 'Any') {
        const min = bedrooms === '5+' ? 5 : parseInt(bedrooms);
        if (bedrooms === '5+' ? p.bedrooms < 5 : p.bedrooms !== min) return false;
      }
      if (verifiedOnly && !p.verified) return false;
      return true;
    });
  }, [query, city, type, propType, priceRange, bedrooms, verifiedOnly]);

  const FilterPanel = () => (
    <div className="space-y-6">
      {/* Listing Type */}
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Listing Type</label>
        <div className="flex flex-wrap gap-2">
          {['All', ...listingTypes].map(t => (
            <button key={t}
              onClick={() => setType(t as typeof type)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                type === t ? 'bg-brand-700 text-white border-brand-700' : 'bg-white text-gray-600 border-gray-200 hover:border-brand-300'
              }`}
            >{t}</button>
          ))}
        </div>
      </div>

      {/* City */}
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">City</label>
        <select value={city} onChange={e => setCity(e.target.value)}
          className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 bg-white focus:outline-none focus:border-brand-400">
          {cities.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>

      {/* Property Type */}
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Property Type</label>
        <div className="flex flex-wrap gap-2">
          {['All', ...propertyTypes].map(t => (
            <button key={t}
              onClick={() => setPropType(t as typeof propType)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                propType === t ? 'bg-brand-700 text-white border-brand-700' : 'bg-white text-gray-600 border-gray-200 hover:border-brand-300'
              }`}
            >{t}</button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Price Range</label>
        <div className="space-y-1">
          {priceRanges.map(range => (
            <button key={range.label}
              onClick={() => setPriceRange(range)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                priceRange.label === range.label ? 'bg-brand-50 text-brand-700 font-medium' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >{range.label}</button>
          ))}
        </div>
      </div>

      {/* Bedrooms */}
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Bedrooms</label>
        <div className="flex gap-2">
          {bedroomOptions.map(b => (
            <button key={b}
              onClick={() => setBedrooms(b)}
              className={`flex-1 py-2 rounded-lg text-xs font-medium border transition-all ${
                bedrooms === b ? 'bg-brand-700 text-white border-brand-700' : 'bg-white text-gray-600 border-gray-200 hover:border-brand-300'
              }`}
            >{b}</button>
          ))}
        </div>
      </div>

      {/* Verified Only */}
      <div className="flex items-center justify-between py-3 border-t border-gray-100">
        <div>
          <p className="text-sm font-medium text-gray-800">Verified Only</p>
          <p className="text-xs text-gray-400">Show verified listings only</p>
        </div>
        <button
          onClick={() => setVerifiedOnly(v => !v)}
          className={`w-11 h-6 rounded-full transition-all relative ${verifiedOnly ? 'bg-brand-700' : 'bg-gray-200'}`}
        >
          <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${verifiedOnly ? 'left-5' : 'left-0.5'}`} />
        </button>
      </div>

      {/* Clear */}
      <button
        onClick={() => { setQuery(''); setCity('All Cities'); setType('All'); setPropType('All'); setPriceRange(priceRanges[0]); setBedrooms('Any'); setVerifiedOnly(false); }}
        className="w-full py-2.5 text-sm text-gray-500 hover:text-gray-800 border border-gray-200 rounded-xl transition-colors"
      >
        Clear All Filters
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-cream-100 pt-20">
      {/* Page Header */}
      <div className="bg-forest-900 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-display font-semibold text-white text-3xl sm:text-4xl mb-2">
            Property Listings
          </h1>
          <p className="text-white/50 text-sm flex items-center gap-2">
            <MapPin size={13} /> Nigeria's most verified property listings
          </p>

          {/* Search bar */}
          <div className="flex gap-3 mt-6 max-w-xl">
            <div className="flex-1 relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search location, area, property..."
                value={query}
                onChange={e => setQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-3 bg-white rounded-xl text-sm outline-none border border-gray-200 focus:border-brand-400"
              />
            </div>
            <button
              onClick={() => setMobileFilter(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-3 bg-white rounded-xl text-sm font-medium text-gray-700 border border-gray-200"
            >
              <SlidersHorizontal size={15} /> Filters
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24 bg-white rounded-2xl border border-gray-100 p-5">
              <h2 className="font-semibold text-gray-900 text-sm mb-5 flex items-center gap-2">
                <SlidersHorizontal size={15} /> Filters
              </h2>
              <FilterPanel />
            </div>
          </aside>

          {/* Grid */}
          <div className="flex-1 min-w-0">
            {/* Results count */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-gray-500">
                <span className="font-semibold text-gray-900">{filtered.length}</span> properties found
              </p>
            </div>

            {filtered.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {filtered.map((p, i) => (
                  <PropertyCard key={p.id} property={p} index={i} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
                  <Search size={24} className="text-gray-400" />
                </div>
                <h3 className="font-semibold text-gray-800 text-lg mb-1">No properties found</h3>
                <p className="text-gray-400 text-sm">Try adjusting your filters or search terms.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {mobileFilter && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-40 lg:hidden"
              onClick={() => setMobileFilter(false)}
            />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 w-80 bg-white z-50 overflow-y-auto p-5 lg:hidden"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-semibold text-gray-900">Filters</h2>
                <button onClick={() => setMobileFilter(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X size={18} />
                </button>
              </div>
              <FilterPanel />
              <button
                onClick={() => setMobileFilter(false)}
                className="mt-4 w-full py-3 bg-brand-700 text-white font-semibold rounded-xl"
              >
                Show {filtered.length} Properties
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
