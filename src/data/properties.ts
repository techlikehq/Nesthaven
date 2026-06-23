export type PropertyType = 'Apartment' | 'Duplex' | 'Bungalow' | 'Terraced' | 'Self-Contain' | 'Penthouse';
export type ListingType = 'Rent' | 'Sale' | 'Shortlet';
export type PropertyStatus = 'Available' | 'Taken' | 'Pending';

export interface Agent {
  id: string;
  name: string;
  phone: string;
  photo: string;
  verified: boolean;
  rating: number;
  deals: number;
  agency: string;
}

export interface Property {
  id: string;
  title: string;
  address: string;
  city: string;
  neighbourhood: string;
  state: string;
  price: number;
  listingType: ListingType;
  propertyType: PropertyType;
  bedrooms: number;
  bathrooms: number;
  toilets: number;
  sqft: number;
  status: PropertyStatus;
  verified: boolean;
  featured: boolean;
  images: string[];
  amenities: string[];
  description: string;
  neighbourhoodScore: number;
  agent: Agent;
  moveInCost: {
    rent: number;
    agencyFee: number;
    legalFee: number;
    cautionFee: number;
  };
  coordinates: { lat: number; lng: number };
  postedAt: string;
}

export const agents: Agent[] = [
  {
    id: 'e062948c-4862-4074-b80a-51296ab48ef1',
    name: 'Chidinma Okafor',
    phone: '+2348012345678',
    photo: 'https://api.dicebear.com/7.x/personas/svg?seed=chidinma',
    verified: true,
    rating: 4.9,
    deals: 47,
    agency: 'Apex Realty PHC',
  },
  {
    id: 'd2806b14-1a90-46cf-be68-c6eb81f724ea',
    name: 'Emeka Eze',
    phone: '+2348023456789',
    photo: 'https://api.dicebear.com/7.x/personas/svg?seed=emeka',
    verified: true,
    rating: 4.7,
    deals: 32,
    agency: 'Prime Property Hub',
  },
  {
    id: '439824a0-f4e3-4fce-be71-4e75bcac96a3',
    name: 'Fatima Abubakar',
    phone: '+2348034567890',
    photo: 'https://api.dicebear.com/7.x/personas/svg?seed=fatima',
    verified: true,
    rating: 4.8,
    deals: 61,
    agency: 'TrustHome Abuja',
  },
  {
    id: '043414ab-16c6-403b-97ce-87c44ca0b07b',
    name: 'Seun Adeyemi',
    phone: '+2348045678901',
    photo: 'https://api.dicebear.com/7.x/personas/svg?seed=seun',
    verified: true,
    rating: 4.6,
    deals: 29,
    agency: 'Lagos Nest Realty',
  },
];

export const properties: Property[] = [
  {
    id: 'p1',
    title: 'Luxury 3-Bedroom Apartment, GRA Phase 2',
    address: '14 Woji Road, GRA Phase 2',
    city: 'Port Harcourt',
    neighbourhood: 'GRA Phase 2',
    state: 'Rivers State',
    price: 3500000,
    listingType: 'Rent',
    propertyType: 'Apartment',
    bedrooms: 3,
    bathrooms: 3,
    toilets: 4,
    sqft: 1850,
    status: 'Available',
    verified: true,
    featured: true,
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
    ],
    amenities: ['Generator', '24/7 Security', 'Swimming Pool', 'Parking', 'CCTV', 'Water Supply'],
    description: 'A beautifully finished 3-bedroom apartment in the heart of GRA Phase 2. Features modern fittings, ample parking, and 24/7 security. Ideal for families and professionals.',
    neighbourhoodScore: 92,
    agent: agents[0],
    moveInCost: {
      rent: 3500000,
      agencyFee: 350000,
      legalFee: 175000,
      cautionFee: 350000,
    },
    coordinates: { lat: 4.8156, lng: 7.0498 },
    postedAt: '2025-01-10',
  },
  {
    id: 'p2',
    title: 'Modern 4-Bedroom Duplex, Woji',
    address: '7 Chevron Drive, Woji',
    city: 'Port Harcourt',
    neighbourhood: 'Woji',
    state: 'Rivers State',
    price: 85000000,
    listingType: 'Sale',
    propertyType: 'Duplex',
    bedrooms: 4,
    bathrooms: 4,
    toilets: 5,
    sqft: 3200,
    status: 'Available',
    verified: true,
    featured: true,
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800',
    ],
    amenities: ['Generator', 'BQ', 'Garden', 'Parking x3', 'Water Borehole', 'CCTV'],
    description: 'Stunning fully detached 4-bedroom duplex with BQ, set on a large plot in Woji. Excellent finishing throughout with imported tiles and fittings.',
    neighbourhoodScore: 88,
    agent: agents[1],
    moveInCost: {
      rent: 85000000,
      agencyFee: 2550000,
      legalFee: 1275000,
      cautionFee: 0,
    },
    coordinates: { lat: 4.8412, lng: 7.0231 },
    postedAt: '2025-01-08',
  },
  {
    id: 'p3',
    title: 'Serviced 2-Bedroom Flat, Old GRA',
    address: '22 Azikiwe Road, Old GRA',
    city: 'Port Harcourt',
    neighbourhood: 'Old GRA',
    state: 'Rivers State',
    price: 2200000,
    listingType: 'Rent',
    propertyType: 'Apartment',
    bedrooms: 2,
    bathrooms: 2,
    toilets: 2,
    sqft: 1100,
    status: 'Available',
    verified: true,
    featured: false,
    images: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
    ],
    amenities: ['Generator', 'Security', 'Parking', 'Water Supply', 'Tiled'],
    description: 'Well-maintained 2-bedroom flat in serene Old GRA. Perfect for a small family or working couple. All rooms en-suite.',
    neighbourhoodScore: 85,
    agent: agents[0],
    moveInCost: {
      rent: 2200000,
      agencyFee: 220000,
      legalFee: 110000,
      cautionFee: 220000,
    },
    coordinates: { lat: 4.7880, lng: 6.9987 },
    postedAt: '2025-01-12',
  },
  {
    id: 'p4',
    title: 'Executive Penthouse, Victoria Island',
    address: '1 Adeola Odeku Street, VI',
    city: 'Port Harcourt',
    neighbourhood: 'D-Line',
    state: 'Rivers State',
    price: 12000000,
    listingType: 'Rent',
    propertyType: 'Penthouse',
    bedrooms: 4,
    bathrooms: 5,
    toilets: 5,
    sqft: 4500,
    status: 'Available',
    verified: true,
    featured: true,
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
      'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800',
    ],
    amenities: ['Gym', 'Pool', 'Concierge', 'Generator', 'Elevator', 'Smart Home', 'Ocean View'],
    description: 'An ultra-luxury penthouse with panoramic ocean views. Features a private terrace, smart home automation, and world-class finishes. The pinnacle of Lagos living.',
    neighbourhoodScore: 97,
    agent: agents[3],
    moveInCost: {
      rent: 12000000,
      agencyFee: 1200000,
      legalFee: 600000,
      cautionFee: 1200000,
    },
    coordinates: { lat: 6.4281, lng: 3.4219 },
    postedAt: '2025-01-05',
  },
  {
    id: 'p5',
    title: '3-Bedroom Terraced Duplex, Lekki Phase 1',
    address: '18 Freedom Way, Lekki Phase 1',
    city: 'Port Harcourt',
    neighbourhood: 'Trans-Amadi',
    state: 'Rivers State',
    price: 55000000,
    listingType: 'Sale',
    propertyType: 'Terraced',
    bedrooms: 3,
    bathrooms: 3,
    toilets: 4,
    sqft: 2100,
    status: 'Available',
    verified: true,
    featured: true,
    images: [
      'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=800',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800',
    ],
    amenities: ['Estate Security', 'Generator', 'Parking x2', 'Garden', 'Water Supply'],
    description: 'Contemporary terraced duplex in a well-secured estate in Lekki Phase 1. Modern kitchen, spacious living areas, and excellent neighbourhood.',
    neighbourhoodScore: 91,
    agent: agents[3],
    moveInCost: {
      rent: 55000000,
      agencyFee: 1650000,
      legalFee: 825000,
      cautionFee: 0,
    },
    coordinates: { lat: 6.4474, lng: 3.5217 },
    postedAt: '2025-01-09',
  },
  {
    id: 'p6',
    title: '5-Bedroom Detached Mansion, Maitama',
    address: '3 Aguiyi Ironsi Street, Maitama',
    city: 'Port Harcourt',
    neighbourhood: 'D-Line',
    state: 'Rivers State',
    price: 250000000,
    listingType: 'Sale',
    propertyType: 'Duplex',
    bedrooms: 5,
    bathrooms: 6,
    toilets: 7,
    sqft: 6800,
    status: 'Available',
    verified: true,
    featured: false,
    images: [
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800',
      'https://images.unsplash.com/photo-1600047509782-20d39509f26d?w=800',
    ],
    amenities: ['Swimming Pool', 'Gym', 'Cinema Room', 'Generator 100kva', 'BQ x2', 'Smart Home', 'Garden'],
    description: 'An extraordinary 5-bedroom mansion in Abuja\'s most exclusive neighbourhood. Unmatched luxury finishes, expansive grounds, and exceptional security.',
    neighbourhoodScore: 99,
    agent: agents[2],
    moveInCost: {
      rent: 250000000,
      agencyFee: 7500000,
      legalFee: 3750000,
      cautionFee: 0,
    },
    coordinates: { lat: 9.0846, lng: 7.4994 },
    postedAt: '2025-01-03',
  },
  {
    id: 'p7',
    title: 'Cosy 1-Bedroom Self-Contain, Peter Odili Road',
    address: '45B Peter Odili Road',
    city: 'Port Harcourt',
    neighbourhood: 'Peter Odili',
    state: 'Rivers State',
    price: 650000,
    listingType: 'Rent',
    propertyType: 'Self-Contain',
    bedrooms: 1,
    bathrooms: 1,
    toilets: 1,
    sqft: 480,
    status: 'Available',
    verified: true,
    featured: false,
    images: [
      'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800',
    ],
    amenities: ['Security', 'Water Supply', 'Prepaid Meter'],
    description: 'A clean and affordable self-contain apartment. Perfect for a working single professional. Well-ventilated rooms with tiled floors.',
    neighbourhoodScore: 72,
    agent: agents[0],
    moveInCost: {
      rent: 650000,
      agencyFee: 65000,
      legalFee: 32500,
      cautionFee: 65000,
    },
    coordinates: { lat: 4.8021, lng: 7.0133 },
    postedAt: '2025-01-14',
  },
  {
    id: 'p8',
    title: '3-Bedroom Bungalow, Rumuola',
    address: '9 Bodo Street, Rumuola',
    city: 'Port Harcourt',
    neighbourhood: 'Rumuola',
    state: 'Rivers State',
    price: 1800000,
    listingType: 'Rent',
    propertyType: 'Bungalow',
    bedrooms: 3,
    bathrooms: 2,
    toilets: 3,
    sqft: 1400,
    status: 'Available',
    verified: false,
    featured: false,
    images: [
      'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800',
    ],
    amenities: ['Parking', 'Water Supply', 'Spacious Compound'],
    description: 'Spacious 3-bedroom bungalow in a calm neighbourhood in Rumuola. Large compound with room for children to play. Close to major roads.',
    neighbourhoodScore: 68,
    agent: agents[1],
    moveInCost: {
      rent: 1800000,
      agencyFee: 180000,
      legalFee: 90000,
      cautionFee: 180000,
    },
    coordinates: { lat: 4.8290, lng: 7.0401 },
    postedAt: '2025-01-11',
  },
];

export const formatPrice = (price: number, type: ListingType): string => {
  const formatted = new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(price);
  if (type === 'Rent') return `${formatted}/yr`;
  if (type === 'Shortlet') return `${formatted}/night`;
  return formatted;
};

export const cities = ['All Cities', 'Port Harcourt', 'Lagos', 'Abuja', 'Enugu', 'Kano'];
export const propertyTypes: PropertyType[] = ['Apartment', 'Duplex', 'Bungalow', 'Terraced', 'Self-Contain', 'Penthouse'];
export const listingTypes: ListingType[] = ['Rent', 'Sale', 'Shortlet'];
