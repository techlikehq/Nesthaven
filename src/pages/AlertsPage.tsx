import React, { useState } from 'react';
import { Link } from 'react-router';
import { ArrowLeft, Bell, CheckCircle2 } from 'lucide-react';
import { cities, propertyTypes, listingTypes } from '../data/properties';

export default function AlertsPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    email: '', phone: '',
    listingType: 'Rent', propertyType: 'Apartment', city: 'Port Harcourt',
    minBudget: '', maxBudget: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <main className="bg-[#F9F6F0] min-h-screen pt-28 pb-24 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center px-6">
          <div className="w-14 h-14 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={26} className="text-white" />
          </div>
          <h1 className="font-serif font-light text-3xl text-neutral-900 mb-3">Alert Activated</h1>
          <p className="text-neutral-500 text-sm leading-relaxed mb-8">
            We'll notify you at <span className="font-medium text-neutral-700">{form.email || 'your email'}</span> the moment a matching {form.propertyType.toLowerCase()} listing goes live in {form.city}.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-3 text-xs font-bold tracking-widest uppercase text-white bg-neutral-900 hover:bg-amber-600 px-6 py-3.5 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-[#F9F6F0] min-h-screen pt-28 pb-24">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">

        <Link to="/" className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-neutral-500 hover:text-amber-600 transition-colors mb-10">
          <ArrowLeft size={14} /> Back Home
        </Link>

        <div className="mb-12 space-y-4">
          <p className="text-amber-600 text-xs font-bold tracking-[0.25em] uppercase">
            // PROPERTY ALERTS
          </p>
          <h1
            className="font-serif font-light text-neutral-900 leading-[1.1] tracking-tight"
            style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.6rem)' }}
          >
            Get Notified <span className="font-serif italic text-neutral-700">First</span>
          </h1>
          <p className="text-neutral-500 text-sm leading-relaxed">
            Tell us what you want. We'll notify you the moment a matching property is listed.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white border border-neutral-200 p-8 md:p-10 space-y-6">

          <div className="flex items-center gap-2 mb-2">
            <Bell size={16} className="text-amber-600" />
            <h2 className="font-sans font-black text-neutral-900 text-xs tracking-wider uppercase">Alert Preferences</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block mb-1.5">Email Address</label>
              <input required type="email" name="email" value={form.email} onChange={handleChange}
                placeholder="jane@example.com"
                className="w-full border border-neutral-300 px-4 py-3 text-sm focus:outline-none focus:border-amber-600 transition-colors" />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block mb-1.5">Phone (optional)</label>
              <input type="text" name="phone" value={form.phone} onChange={handleChange}
                placeholder="+234 801 234 5678"
                className="w-full border border-neutral-300 px-4 py-3 text-sm focus:outline-none focus:border-amber-600 transition-colors" />
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block mb-1.5">Listing Type</label>
              <select name="listingType" value={form.listingType} onChange={handleChange}
                className="w-full border border-neutral-300 px-4 py-3 text-sm focus:outline-none focus:border-amber-600 bg-white">
                {listingTypes.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block mb-1.5">Property Type</label>
              <select name="propertyType" value={form.propertyType} onChange={handleChange}
                className="w-full border border-neutral-300 px-4 py-3 text-sm focus:outline-none focus:border-amber-600 bg-white">
                {propertyTypes.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block mb-1.5">City</label>
              <select name="city" value={form.city} onChange={handleChange}
                className="w-full border border-neutral-300 px-4 py-3 text-sm focus:outline-none focus:border-amber-600 bg-white">
                {cities.filter(c => c !== 'All Cities').map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block mb-1.5">Min Budget</label>
                <input type="number" name="minBudget" value={form.minBudget} onChange={handleChange} placeholder="₦"
                  className="w-full border border-neutral-300 px-3 py-3 text-sm focus:outline-none focus:border-amber-600 transition-colors font-mono" />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block mb-1.5">Max Budget</label>
                <input type="number" name="maxBudget" value={form.maxBudget} onChange={handleChange} placeholder="₦"
                  className="w-full border border-neutral-300 px-3 py-3 text-sm focus:outline-none focus:border-amber-600 transition-colors font-mono" />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-neutral-900 hover:bg-amber-600 text-white text-xs font-bold tracking-widest uppercase transition-colors"
          >
            Activate Alert
          </button>
        </form>
      </div>
    </main>
  );
}
