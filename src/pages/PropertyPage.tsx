import React, { useState } from 'react';
import { useParams, Link } from 'react-router';
import { motion } from 'motion/react';
import {
  ArrowLeft, Bed, Bath, Maximize2, MapPin, Shield, MessageCircle,
  Star, CheckCircle2, Calculator,
} from 'lucide-react';
import { properties, formatPrice } from '../data/properties';
import ChatPanel from '../components/chat/ChatPanel';

export default function PropertyPage() {
  const { id } = useParams();
  const property = properties.find(p => p.id === id);
  const [activeImg, setActiveImg] = useState(0);
  const [chatOpen, setChatOpen] = useState(false);

  if (!property) {
    return (
      <main className="bg-[#F9F6F0] min-h-screen pt-28 pb-24 flex items-center justify-center">
        <div className="text-center px-6">
          <h1 className="font-serif text-3xl text-neutral-900 mb-3">Property Not Found</h1>
          <p className="text-neutral-500 text-sm mb-8">This listing may have been removed or the link is incorrect.</p>
          <Link to="/listings" className="inline-flex items-center gap-3 text-xs font-bold tracking-widest uppercase text-white bg-neutral-900 hover:bg-amber-600 px-6 py-3.5 transition-colors">
            Browse Listings
          </Link>
        </div>
      </main>
    );
  }

  const whatsappMsg = encodeURIComponent(
    `Hello ${property.agent.name}, I'm interested in: ${property.title} (${formatPrice(property.price, property.listingType)}). Is it still available?`
  );

  const totalMoveIn = property.moveInCost.rent + property.moveInCost.agencyFee + property.moveInCost.legalFee + property.moveInCost.cautionFee;

  return (
    <main className="bg-[#F9F6F0] min-h-screen pt-24 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <Link to="/listings" className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-neutral-500 hover:text-amber-600 transition-colors mb-6">
          <ArrowLeft size={14} /> Back to Listings
        </Link>

        <div className="mb-10">
          <div className="relative h-[420px] overflow-hidden mb-2 bg-neutral-200">
            <img src={property.images[activeImg]} alt={property.title} className="w-full h-full object-cover" />
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <span className="px-3 py-1.5 bg-neutral-950 text-white text-[10px] font-bold tracking-widest uppercase">
                {property.listingType}
              </span>
              {property.verified && (
                <span className="flex items-center gap-1 px-3 py-1.5 bg-white text-[10px] font-bold tracking-widest uppercase text-emerald-700">
                  <Shield size={10} /> Verified
                </span>
              )}
            </div>
          </div>
          {property.images.length > 1 && (
            <div className="flex gap-2">
              {property.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`w-20 h-16 overflow-hidden border-2 transition-colors ${activeImg === i ? 'border-amber-600' : 'border-transparent'}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

          <div className="lg:col-span-8 space-y-10">

            <div>
              <div className="flex items-start justify-between gap-4 mb-3">
                <h1 className="font-serif text-3xl font-medium text-neutral-900 leading-tight">{property.title}</h1>
                <span className="shrink-0 inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 border border-amber-200 text-[11px] font-bold text-amber-700">
                  <Star size={10} className="fill-amber-600 text-amber-600" /> {property.neighbourhoodScore}
                </span>
              </div>
              <p className="flex items-center gap-1.5 text-sm text-neutral-500 mb-6">
                <MapPin size={13} /> {property.address}, {property.neighbourhood}, {property.city}
              </p>

              <div className="flex items-center gap-6 py-5 border-t border-b border-neutral-200">
                <span className="flex items-center gap-2 text-sm text-neutral-700">
                  <Bed size={16} className="text-neutral-400" /> {property.bedrooms} Bed{property.bedrooms !== 1 ? 's' : ''}
                </span>
                <span className="flex items-center gap-2 text-sm text-neutral-700">
                  <Bath size={16} className="text-neutral-400" /> {property.bathrooms} Bath{property.bathrooms !== 1 ? 's' : ''}
                </span>
                <span className="flex items-center gap-2 text-sm text-neutral-700">
                  <Maximize2 size={16} className="text-neutral-400" /> {property.sqft.toLocaleString()} sqft
                </span>
                <span className="text-sm text-neutral-700">{property.propertyType}</span>
              </div>
            </div>

            <div>
              <h2 className="font-sans font-black text-neutral-900 text-xs tracking-wider uppercase mb-4">Description</h2>
              <p className="text-neutral-600 text-sm leading-relaxed">{property.description}</p>
            </div>

            <div>
              <h2 className="font-sans font-black text-neutral-900 text-xs tracking-wider uppercase mb-4">Amenities</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {property.amenities.map(a => (
                  <span key={a} className="flex items-center gap-2 text-sm text-neutral-600">
                    <CheckCircle2 size={14} className="text-emerald-600 shrink-0" /> {a}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h2 className="font-sans font-black text-neutral-900 text-xs tracking-wider uppercase mb-4 flex items-center gap-2">
                <Calculator size={14} className="text-amber-600" /> Move-In Cost Breakdown
              </h2>
              <div className="bg-white border border-neutral-200 overflow-hidden">
                {[
                  { label: property.listingType === 'Rent' ? 'Annual Rent' : 'Property Price', value: property.moveInCost.rent },
                  { label: 'Agency Fee', value: property.moveInCost.agencyFee },
                  { label: 'Legal Fee', value: property.moveInCost.legalFee },
                  { label: 'Caution Deposit', value: property.moveInCost.cautionFee },
                ].map((row, i) => (
                  <div key={row.label} className={`flex items-center justify-between px-5 py-3.5 ${i < 3 ? 'border-b border-neutral-100' : ''}`}>
                    <span className="text-sm text-neutral-600">{row.label}</span>
                    <span className="font-mono text-sm font-semibold text-neutral-900">₦{row.value.toLocaleString()}</span>
                  </div>
                ))}
                <div className="bg-neutral-950 px-5 py-4 flex items-center justify-between">
                  <span className="text-xs font-bold tracking-widest uppercase text-neutral-400">Total</span>
                  <span className="font-mono text-lg font-bold text-amber-400">₦{totalMoveIn.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="sticky top-24 bg-white border border-neutral-200 p-6">
              <p className="font-serif text-2xl font-semibold text-neutral-900 mb-1">
                {formatPrice(property.price, property.listingType)}
              </p>
              {property.listingType === 'Rent' && (
                <p className="text-xs text-neutral-400 font-mono mb-5">
                  ≈ ₦{(property.price / 12).toLocaleString()}/month
                </p>
              )}

              <div className="flex items-center gap-3 py-4 border-t border-b border-neutral-100 mb-5">
                <div className="w-11 h-11 rounded-full bg-neutral-100 overflow-hidden shrink-0">
                  <img src={property.agent.photo} alt={property.agent.name} className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-neutral-900 truncate">{property.agent.name}</p>
                  <p className="text-xs text-neutral-400 truncate">{property.agent.agency}</p>
                  {property.agent.verified && (
                    <p className="text-[10px] text-emerald-600 flex items-center gap-1 mt-0.5">
                      <Shield size={9} /> Verified Agent
                    </p>
                  )}
                </div>
              </div>

              <button
                onClick={() => setChatOpen(true)}
                className="flex items-center justify-center gap-2 w-full py-3.5 bg-neutral-900 hover:bg-amber-600 text-white text-xs font-bold tracking-widest uppercase transition-colors mb-3"
              >
                <MessageCircle size={14} /> Chat Securely on NestHaven
              </button>
              <Link
                to={`/areas/${property.neighbourhood.toLowerCase().replace(/[\s/]+/g, '-')}`}
                className="flex items-center justify-center gap-2 w-full py-3.5 bg-neutral-900 hover:bg-amber-600 text-white text-xs font-bold tracking-widest uppercase transition-colors"
              >
                View {property.neighbourhood} Area Report
              </Link>
            </div>
          </div>
        </div>
      </div>

      <ChatPanel
        open={chatOpen}
        onClose={() => setChatOpen(false)}
        agentId={property.agent.id}
        agentName={property.agent.name}
        agentPhoto={property.agent.photo}
        agentVerified={property.agent.verified}
        propertyId={property.id}
        propertyTitle={property.title}
      />
    </main>
  );
}
