export interface Neighbourhood {
  id: string;
  name: string;
  city: string;
  state: string;
  score: number;
  avgRentApartment: number;
  avgSalePrice: number;
  ratings: {
    security: number;
    infrastructure: number;
    transport: number;
    amenities: number;
    flooding: number;
  };
  highlights: string[];
  description: string;
  image: string;
  trending: boolean;
}

export const neighbourhoods: Neighbourhood[] = [
  {
    id: 'n1',
    name: 'GRA Phase 2',
    city: 'Port Harcourt',
    state: 'Rivers State',
    score: 92,
    avgRentApartment: 3200000,
    avgSalePrice: 90000000,
    ratings: {
      security: 95,
      infrastructure: 90,
      transport: 85,
      amenities: 92,
      flooding: 88,
    },
    highlights: ['Low flooding risk', 'Top schools nearby', 'Paved roads', '24/7 security estates'],
    description: 'One of Port Harcourt\'s most prestigious addresses. Well-planned roads, excellent drainage, and proximity to major businesses.',
    image: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600',
    trending: true,
  },
  {
    id: 'n2',
    name: 'Old GRA',
    city: 'Port Harcourt',
    state: 'Rivers State',
    score: 85,
    avgRentApartment: 2000000,
    avgSalePrice: 65000000,
    ratings: {
      security: 88,
      infrastructure: 82,
      transport: 80,
      amenities: 87,
      flooding: 84,
    },
    highlights: ['Quiet and serene', 'Close to Government House', 'Good road network', 'Low crime rate'],
    description: 'A historic and calm neighbourhood favoured by government workers and professionals. Tree-lined streets and well-maintained properties.',
    image: 'https://images.unsplash.com/photo-1449157291145-7efd050a4d0e?w=600',
    trending: false,
  },
  {
    id: 'n3',
    name: 'Woji',
    city: 'Port Harcourt',
    state: 'Rivers State',
    score: 88,
    avgRentApartment: 2800000,
    avgSalePrice: 75000000,
    ratings: {
      security: 86,
      infrastructure: 89,
      transport: 90,
      amenities: 88,
      flooding: 82,
    },
    highlights: ['Near Rumuola junction', 'Multiple shopping malls', 'Rapidly developing', 'Good road access'],
    description: 'A fast-growing upscale neighbourhood with excellent road connections to the East-West Road and Trans-Amadi industrial area.',
    image: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=600',
    trending: true,
  },
  {
    id: 'n4',
    name: 'Victoria Island',
    city: 'Lagos',
    state: 'Lagos State',
    score: 97,
    avgRentApartment: 10000000,
    avgSalePrice: 350000000,
    ratings: {
      security: 96,
      infrastructure: 98,
      transport: 92,
      amenities: 99,
      flooding: 88,
    },
    highlights: ['Financial district hub', 'World-class restaurants', 'International schools', 'Business HQs'],
    description: 'Lagos\'s most prestigious commercial and residential island. Home to multinationals, embassies, and Nigeria\'s elite.',
    image: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=600',
    trending: false,
  },
  {
    id: 'n5',
    name: 'Lekki Phase 1',
    city: 'Lagos',
    state: 'Lagos State',
    score: 91,
    avgRentApartment: 7000000,
    avgSalePrice: 180000000,
    ratings: {
      security: 90,
      infrastructure: 92,
      transport: 85,
      amenities: 93,
      flooding: 82,
    },
    highlights: ['Gated estates', 'Lekki-Epe Expressway access', 'Nightlife & dining', 'International schools'],
    description: 'A highly sought-after neighbourhood along the Lekki corridor. Mix of luxury estates and vibrant commercial activity.',
    image: 'https://images.unsplash.com/photo-1496568816309-51d7c20e3b21?w=600',
    trending: true,
  },
  {
    id: 'n6',
    name: 'Maitama',
    city: 'Abuja',
    state: 'FCT',
    score: 99,
    avgRentApartment: 15000000,
    avgSalePrice: 500000000,
    ratings: {
      security: 99,
      infrastructure: 99,
      transport: 95,
      amenities: 99,
      flooding: 98,
    },
    highlights: ['Embassies nearby', 'Perfect road network', 'No flooding history', 'Diplomatic zone'],
    description: 'Abuja\'s most exclusive residential zone. Home to diplomats, ministers, and top executives. Impeccable infrastructure and security.',
    image: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600',
    trending: false,
  },
];

export const getScoreLabel = (score: number): { label: string; color: string } => {
  if (score >= 90) return { label: 'Excellent', color: '#16a34a' };
  if (score >= 75) return { label: 'Good', color: '#ca8a04' };
  if (score >= 60) return { label: 'Fair', color: '#ea580c' };
  return { label: 'Below Average', color: '#dc2626' };
};
