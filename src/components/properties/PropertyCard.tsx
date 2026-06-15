import { useState } from 'react';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import {
  Bed, Bath, Maximize2, MapPin, Shield, Heart,
  MessageCircle, Star,
} from 'lucide-react';
import { Property, formatPrice } from '../../data/properties';

interface PropertyCardProps {
  property: Property;
  index?: number;
}

export default function PropertyCard({ property, index = 0 }: PropertyCardProps) {
  const [liked, setLiked] = useState(false);
  const [imgError, setImgError] = useState(false);

  const scoreColor =
    property.neighbourhoodScore >= 90 ? 'text-green-600 bg-green-50' :
    property.neighbourhoodScore >= 75 ? 'text-amber-600 bg-amber-50' :
    'text-orange-600 bg-orange-50';

  const listingBadgeColor =
    property.listingType === 'Sale' ? 'bg-brand-700 text-white' :
    property.listingType === 'Shortlet' ? 'bg-amber-500 text-white' :
    'bg-sky-600 text-white';

  const whatsappMsg = encodeURIComponent(
    `Hello ${property.agent.name}, I'm interested in: ${property.title} (${formatPrice(property.price, property.listingType)}). Is it still available?`
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07, ease: [0.19, 1, 0.22, 1] }}
      className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-brand-200 hover:shadow-xl hover:shadow-brand-900/8 transition-all duration-400"
    >
      {/* Image */}
      <div className="relative overflow-hidden aspect-[4/3]">
        {!imgError ? (
          <img
            src={property.images[0]}
            alt={property.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-brand-100 to-brand-200 flex items-center justify-center">
            <MapPin size={32} className="text-brand-400" />
          </div>
        )}

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        {/* Top badges */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${listingBadgeColor}`}>
            {property.listingType}
          </span>
          {property.verified && (
            <span className="flex items-center gap-1 px-2 py-1 bg-white/95 rounded-lg text-xs font-semibold text-green-700">
              <Shield size={10} /> Verified
            </span>
          )}
        </div>

        {/* Like button */}
        <button
          onClick={() => setLiked(v => !v)}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow-sm transition-all hover:scale-110"
        >
          <Heart
            size={15}
            className={liked ? 'fill-red-500 text-red-500' : 'text-gray-400'}
          />
        </button>

        {/* Neighbourhood score */}
        <div className={`absolute bottom-3 right-3 flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold ${scoreColor} bg-white/95`}>
          <Star size={10} className="fill-current" />
          {property.neighbourhoodScore}
        </div>

        {/* Status if not available */}
        {property.status !== 'Available' && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="px-4 py-2 bg-white rounded-xl font-semibold text-gray-800">
              {property.status}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Price */}
        <div className="flex items-start justify-between mb-2">
          <div>
            <p className="font-display font-semibold text-xl text-brand-900 leading-tight">
              {formatPrice(property.price, property.listingType)}
            </p>
            {property.listingType === 'Rent' && (
              <p className="text-xs text-gray-400 mt-0.5 font-mono">
                ₦{(property.price / 12).toLocaleString('en-NG')}/month
              </p>
            )}
          </div>
          <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-lg">
            {property.propertyType}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-gray-900 text-sm leading-snug mb-2 line-clamp-2">
          {property.title}
        </h3>

        {/* Location */}
        <div className="flex items-center gap-1 text-xs text-gray-400 mb-3">
          <MapPin size={11} />
          <span className="truncate">{property.neighbourhood}, {property.city}</span>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 text-xs text-gray-500 py-3 border-t border-gray-50">
          <span className="flex items-center gap-1">
            <Bed size={13} className="text-gray-400" />
            {property.bedrooms} Bed{property.bedrooms !== 1 ? 's' : ''}
          </span>
          <span className="flex items-center gap-1">
            <Bath size={13} className="text-gray-400" />
            {property.bathrooms} Bath{property.bathrooms !== 1 ? 's' : ''}
          </span>
          <span className="flex items-center gap-1">
            <Maximize2 size={13} className="text-gray-400" />
            {property.sqft.toLocaleString()} sqft
          </span>
        </div>

        {/* Agent + CTA */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-50">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-brand-100 flex items-center justify-center overflow-hidden">
              <img
                src={property.agent.photo}
                alt={property.agent.name}
                className="w-full h-full object-cover"
                onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-700 leading-none">{property.agent.name}</p>
              {property.agent.verified && (
                <p className="text-[10px] text-green-600 mt-0.5 flex items-center gap-0.5">
                  <Shield size={8} /> Verified Agent
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`https://wa.me/${property.agent.phone.replace(/\D/g, '')}?text=${whatsappMsg}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-lg text-xs font-semibold transition-colors"
              onClick={e => e.stopPropagation()}
            >
              <MessageCircle size={12} />
              WhatsApp
            </a>
            <Link
              to={`/property/${property.id}`}
              className="px-3 py-1.5 bg-brand-50 hover:bg-brand-100 text-brand-700 rounded-lg text-xs font-semibold transition-colors"
            >
              Details
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
