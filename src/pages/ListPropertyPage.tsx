import React, { useState } from 'react';
import { Link } from 'react-router';
import { ArrowLeft, Home, CheckCircle2, Upload } from 'lucide-react';
import { propertyTypes, listingTypes, cities } from '../data/properties';

export default function ListPropertyPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    title: '', listingType: 'Rent', propertyType: 'Apartment',
    city: 'Port Harcourt', address: '', price: '', bedrooms: '',
    bathrooms: '', sqft: '', description: '',
    name: '', phone: '', email: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (submitted) {
    return (
      <main className="bg-[#F9F6F0] min-h-screen pt-28 pb-24 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center px-6">
          <div className="w-14 h-14 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={26} className="text-white" />
          </div>
          <h1 className="font-serif font-light text-3xl text-neutral-900 mb-3">Listing Submitted</h1>
          <p className="text-neutral-500 text-sm leading-relaxed mb-8">
            Thanks, {form.name || 'there'}. Our team will review your property and reach out within 24–48 hours to verify details before it goes live.
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        <Link to="/" className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-neutral-500 hover:text-amber-600 transition-colors mb-10">
          <ArrowLeft size={14} /> Back Home
        </Link>

        <div className="max-w-2xl mb-12 space-y-4">
          <p className="text-amber-600 text-xs font-bold tracking-[0.25em] uppercase">
            // LIST YOUR PROPERTY
          </p>
          <h1
            className="font-serif font-light text-neutral-900 leading-[1.1] tracking-tight"
            style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.6rem)' }}
          >
            Reach Thousands of <br />
            <span className="font-serif italic text-neutral-700">Verified Buyers</span>
          </h1>
          <p className="text-neutral-500 text-sm max-w-xl leading-relaxed">
            Free listing, maximum exposure. Fill in your property details below and our team will verify and publish it.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white border border-neutral-200 p-8 md:p-12 space-y-10">

          <div>
            <h2 className="font-sans font-black text-neutral-900 text-xs tracking-wider uppercase mb-6 flex items-center gap-2">
              <Home size={14} className="text-amber-600" /> Property Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="sm:col-span-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block mb-1.5">Listing Title</label>
                <input
                  required name="title" value={form.title} onChange={handleChange}
                  placeholder="e.g. Luxury 3-Bedroom Apartment, GRA Phase 2"
                  className="w-full border border-neutral-300 px-4 py-3 text-sm focus:outline-none focus:border-amber-600 transition-colors"
                />
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

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block mb-1.5">Price (₦)</label>
                <input
                  required type="number" name="price" value={form.price} onChange={handleChange}
                  placeholder="3500000"
                  className="w-full border border-neutral-300 px-4 py-3 text-sm focus:outline-none focus:border-amber-600 transition-colors"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block mb-1.5">Full Address</label>
                <input
                  required name="address" value={form.address} onChange={handleChange}
                  placeholder="14 Woji Road, GRA Phase 2"
                  className="w-full border border-neutral-300 px-4 py-3 text-sm focus:outline-none focus:border-amber-600 transition-colors"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block mb-1.5">Bedrooms</label>
                <input type="number" name="bedrooms" value={form.bedrooms} onChange={handleChange} placeholder="3"
                  className="w-full border border-neutral-300 px-4 py-3 text-sm focus:outline-none focus:border-amber-600 transition-colors" />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block mb-1.5">Bathrooms</label>
                <input type="number" name="bathrooms" value={form.bathrooms} onChange={handleChange} placeholder="3"
                  className="w-full border border-neutral-300 px-4 py-3 text-sm focus:outline-none focus:border-amber-600 transition-colors" />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block mb-1.5">Size (Sq Ft)</label>
                <input type="number" name="sqft" value={form.sqft} onChange={handleChange} placeholder="1850"
                  className="w-full border border-neutral-300 px-4 py-3 text-sm focus:outline-none focus:border-amber-600 transition-colors" />
              </div>

              <div className="sm:col-span-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block mb-1.5">Description</label>
                <textarea
                  rows={4} name="description" value={form.description} onChange={handleChange}
                  placeholder="Describe the property, its features, and surrounding area..."
                  className="w-full border border-neutral-300 px-4 py-3 text-sm focus:outline-none focus:border-amber-600 transition-colors resize-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block mb-1.5">Photos</label>
                <div className="border border-dashed border-neutral-300 px-6 py-10 text-center text-neutral-400 text-xs">
                  <Upload size={20} className="mx-auto mb-2 text-neutral-300" />
                  Drag photos here or click to upload (coming soon)
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="font-sans font-black text-neutral-900 text-xs tracking-wider uppercase mb-6">
              Your Contact Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block mb-1.5">Full Name</label>
                <input required name="name" value={form.name} onChange={handleChange} placeholder="Jane Smith"
                  className="w-full border border-neutral-300 px-4 py-3 text-sm focus:outline-none focus:border-amber-600 transition-colors" />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block mb-1.5">Phone Number</label>
                <input required name="phone" value={form.phone} onChange={handleChange} placeholder="+234 801 234 5678"
                  className="w-full border border-neutral-300 px-4 py-3 text-sm focus:outline-none focus:border-amber-600 transition-colors" />
              </div>
              <div className="sm:col-span-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block mb-1.5">Email Address</label>
                <input required type="email" name="email" value={form.email} onChange={handleChange} placeholder="jane@example.com"
                  className="w-full border border-neutral-300 px-4 py-3 text-sm focus:outline-none focus:border-amber-600 transition-colors" />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-neutral-900 hover:bg-amber-600 text-white text-xs font-bold tracking-widest uppercase transition-colors"
          >
            Submit Property for Review
          </button>
        </form>
      </div>
    </main>
  );
}
