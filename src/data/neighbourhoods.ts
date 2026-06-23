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
  intelligence: {
    drainage: number;
    powerHoursPerDay: string;
    powerScore: number;
    waterSupply: {
      quality: number;
      label: string;
      source: string;
      note: string;
    };
    floodRisk: boolean;
    cOfO: boolean;
  };
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
    ratings: { security: 95, infrastructure: 90, transport: 85, amenities: 92, flooding: 88 },
    highlights: ['Low flooding risk', 'Top schools nearby', 'Paved roads', '24/7 security estates'],
    description: 'One of Port Harcourt\'s most prestigious addresses. Well-planned roads, excellent drainage, and proximity to major businesses.',
    image: 'https://images.unsplash.com/photo-1548425603-8ac3fa97518b?q=80&w=1035&auto=format&fit=crop&ixlib=rb-4.1.0',
    trending: true,
    intelligence: {
      drainage: 90,
      powerHoursPerDay: '~15h/day',
      powerScore: 63,
      waterSupply: { quality: 4, label: 'Excellent', source: 'Pipe + Borehole', note: 'Dedicated borehole with reliable pipe water backup across most streets.' },
      floodRisk: false,
      cOfO: true,
    },
  },
  {
    id: 'n2',
    name: 'Old GRA',
    city: 'Port Harcourt',
    state: 'Rivers State',
    score: 85,
    avgRentApartment: 2000000,
    avgSalePrice: 65000000,
    ratings: { security: 88, infrastructure: 82, transport: 80, amenities: 87, flooding: 84 },
    highlights: ['Quiet and serene', 'Close to Government House', 'Good road network', 'Low crime rate'],
    description: 'A historic and calm neighbourhood favoured by government workers and professionals. Tree-lined streets and well-maintained properties.',
    image: 'https://images.unsplash.com/photo-1778910554261-837b19e25c26?q=80&w=1671&auto=format&fit=crop&ixlib=rb-4.1.0',
    trending: false,
    intelligence: {
      drainage: 95,
      powerHoursPerDay: '~12h/day',
      powerScore: 50,
      waterSupply: { quality: 3, label: 'Good', source: 'Dedicated Borehole', note: 'Dedicated borehole supply; no consistent public pipe water.' },
      floodRisk: false,
      cOfO: true,
    },
  },
  {
    id: 'n3',
    name: 'Woji',
    city: 'Port Harcourt',
    state: 'Rivers State',
    score: 88,
    avgRentApartment: 2800000,
    avgSalePrice: 75000000,
    ratings: { security: 86, infrastructure: 89, transport: 90, amenities: 88, flooding: 82 },
    highlights: ['Near Rumuola junction', 'Multiple shopping malls', 'Rapidly developing', 'Good road access'],
    description: 'A fast-growing upscale neighbourhood with excellent road connections to the East-West Road and Trans-Amadi industrial area.',
    image: 'https://images.unsplash.com/photo-1724047312390-12fb4047bcb8?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0',
    trending: true,
    intelligence: {
      drainage: 78,
      powerHoursPerDay: '~13h/day',
      powerScore: 54,
      waterSupply: { quality: 3, label: 'Good', source: 'Dedicated Borehole', note: 'Borehole with overhead tank; steady supply across most estates.' },
      floodRisk: false,
      cOfO: true,
    },
  },
  {
    id: 'n4',
    name: 'Trans-Amadi',
    city: 'Port Harcourt',
    state: 'Rivers State',
    score: 80,
    avgRentApartment: 2600000,
    avgSalePrice: 60000000,
    ratings: { security: 82, infrastructure: 85, transport: 88, amenities: 80, flooding: 75 },
    highlights: ['Major industrial corridor', 'Strong road access', 'Growing residential mix', 'Close to commercial hubs'],
    description: 'Major industrial and commercial corridor with a growing mix of residential developments. Strong road access to the rest of the city.',
    image: 'https://images.unsplash.com/photo-1682502524896-6d78b9e8413a?q=80&w=1783&auto=format&fit=crop&ixlib=rb-4.1.0',
    trending: false,
    intelligence: {
      drainage: 75,
      powerHoursPerDay: '~14h/day',
      powerScore: 58,
      waterSupply: { quality: 3, label: 'Good', source: 'Borehole + Tanker Supply', note: 'Most residences rely on private boreholes; tanker delivery common for backup.' },
      floodRisk: false,
      cOfO: true,
    },
  },
  {
    id: 'n5',
    name: 'D-Line',
    city: 'Port Harcourt',
    state: 'Rivers State',
    score: 86,
    avgRentApartment: 2900000,
    avgSalePrice: 70000000,
    ratings: { security: 84, infrastructure: 87, transport: 90, amenities: 90, flooding: 80 },
    highlights: ['Central location', 'High accessibility', 'Busy commercial mix', 'Close to banks and markets'],
    description: 'Central, busy commercial and residential mix close to the heart of the city. High accessibility to banks, markets, and offices.',
    image: 'https://images.unsplash.com/photo-1769780265587-037ee842c0b0?q=80&w=2232&auto=format&fit=crop&ixlib=rb-4.1.0',
    trending: true,
    intelligence: {
      drainage: 82,
      powerHoursPerDay: '~14h/day',
      powerScore: 60,
      waterSupply: { quality: 3, label: 'Good', source: 'Dedicated Borehole', note: 'Borehole supply standard across most buildings; reliable but not municipal.' },
      floodRisk: false,
      cOfO: true,
    },
  },
  {
    id: 'n6',
    name: 'Rumuokoro',
    city: 'Port Harcourt',
    state: 'Rivers State',
    score: 74,
    avgRentApartment: 1600000,
    avgSalePrice: 38000000,
    ratings: { security: 72, infrastructure: 70, transport: 85, amenities: 78, flooding: 65 },
    highlights: ['Major transport junction', 'Mixed-income area', 'Affordable', 'Highly accessible'],
    description: 'Major transport junction connecting multiple parts of the city. Mixed-income area popular for affordability and accessibility.',
    image: 'https://images.unsplash.com/photo-1765850259112-d2ab08aa81ae?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0',
    trending: true,
    intelligence: {
      drainage: 60,
      powerHoursPerDay: '~11h/day',
      powerScore: 46,
      waterSupply: { quality: 2, label: 'Fair', source: 'Borehole + Public Tap', note: 'Mix of private boreholes and shared public water points; supply varies by street.' },
      floodRisk: true,
      cOfO: false,
    },
  },
  {
    id: 'n7',
    name: 'Eliozu',
    city: 'Port Harcourt',
    state: 'Rivers State',
    score: 81,
    avgRentApartment: 2300000,
    avgSalePrice: 55000000,
    ratings: { security: 80, infrastructure: 78, transport: 75, amenities: 82, flooding: 78 },
    highlights: ['Fast-growing area', 'Popular with young professionals', 'New estates', 'Improving roads'],
    description: 'Fast-growing residential area popular with young professionals. New estates and improving road infrastructure.',
    image: 'https://images.unsplash.com/photo-1709147660265-60869622ff48?q=80&w=1065&auto=format&fit=crop&ixlib=rb-4.1.0',
    trending: true,
    intelligence: {
      drainage: 72,
      powerHoursPerDay: '~13h/day',
      powerScore: 54,
      waterSupply: { quality: 3, label: 'Good', source: 'Estate Borehole', note: 'Newer estates typically include dedicated borehole and overhead tank systems.' },
      floodRisk: false,
      cOfO: true,
    },
  },
  {
    id: 'n8',
    name: 'Eagle Island',
    city: 'Port Harcourt',
    state: 'Rivers State',
    score: 79,
    avgRentApartment: 2400000,
    avgSalePrice: 58000000,
    ratings: { security: 78, infrastructure: 74, transport: 70, amenities: 75, flooding: 60 },
    highlights: ['Waterside character', 'Quieter residential feel', 'Mix of property ages', 'Distinct area identity'],
    description: 'Waterside residential area with a distinct, quieter character. Mix of older and newer residential developments.',
    image: 'https://images.unsplash.com/photo-1602336625187-03e0fc511b98?q=80&w=1019&auto=format&fit=crop&ixlib=rb-4.1.0',
    trending: false,
    intelligence: {
      drainage: 58,
      powerHoursPerDay: '~12h/day',
      powerScore: 50,
      waterSupply: { quality: 2, label: 'Fair', source: 'Borehole + Tanker Supply', note: 'Borehole supply common; some streets depend on tanker delivery during dry season.' },
      floodRisk: true,
      cOfO: true,
    },
  },
  {
    id: 'n9',
    name: 'Mile 3 / Diobu',
    city: 'Port Harcourt',
    state: 'Rivers State',
    score: 68,
    avgRentApartment: 1200000,
    avgSalePrice: 28000000,
    ratings: { security: 65, infrastructure: 62, transport: 80, amenities: 85, flooding: 55 },
    highlights: ['Highly affordable', 'Dense and accessible', 'Close to major markets', 'Near motor parks'],
    description: 'Dense, highly affordable area popular with lower-to-mid income renters. Close to major markets and motor parks.',
    image: 'https://images.unsplash.com/photo-1678575326906-711883de9877?q=80&w=2232&auto=format&fit=crop&ixlib=rb-4.1.0',
    trending: false,
    intelligence: {
      drainage: 50,
      powerHoursPerDay: '~10h/day',
      powerScore: 42,
      waterSupply: { quality: 2, label: 'Fair', source: 'Public Tap + Borehole', note: 'Mix of public water points and private boreholes; supply can be inconsistent.' },
      floodRisk: true,
      cOfO: false,
    },
  },
];

export const getScoreLabel = (score: number): { label: string; color: string } => {
  if (score >= 90) return { label: 'Excellent', color: '#16a34a' };
  if (score >= 75) return { label: 'Good', color: '#ca8a04' };
  if (score >= 60) return { label: 'Fair', color: '#ea580c' };
  return { label: 'Below Average', color: '#dc2626' };
};
