import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  ArrowRight, MapPin, Download, ArrowLeft, ChevronRight, ChevronUp, ChevronDown,
  Maximize2, Building2, Layers, CheckCircle2, Home, FileText, Play,
  Shield, Zap, Compass, Calendar, Hammer, Key, Tag, Banknote, Hash,
  BedDouble, Droplet, Car, Paintbrush, Map, Users, Route, Package,
  BarChart3, Star, Landmark, Navigation, Sofa, BadgeCheck,
  Trees, GraduationCap, Bus, Train, Waves, Dumbbell, Camera,
  Leaf, Phone, ShoppingBag, Wifi, HeartPulse, Sun, Lock, Wrench,
} from 'lucide-react';

/* ─────────────────────────────────────────────────────────────
   ICON MAP — sharp, 13px, stroke 1.5
───────────────────────────────────────────────────────────── */
const P = { size: 13, className: 'text-neutral-400 shrink-0', strokeWidth: 1.5 };

const SpecIcon = ({ name }: { name: string }) => {
  const icons: Record<string, React.ReactNode> = {
    tag:        <Tag {...P} />,
    building:   <Building2 {...P} />,
    banknote:   <Banknote {...P} />,
    hash:       <Hash {...P} />,
    check:      <CheckCircle2 {...P} />,
    bed:        <BedDouble {...P} />,
    droplet:    <Droplet {...P} />,
    layers:     <Layers {...P} />,
    maximize:   <Maximize2 {...P} />,
    map:        <Map {...P} />,
    car:        <Car {...P} />,
    brush:      <Paintbrush {...P} />,
    pin:        <MapPin {...P} />,
    calendar:   <Calendar {...P} />,
    key:        <Key {...P} />,
    hammer:     <Hammer {...P} />,
    zap:        <Zap {...P} />,
    shield:     <Shield {...P} />,
    users:      <Users {...P} />,
    file:       <FileText {...P} />,
    package:    <Package {...P} />,
    chart:      <BarChart3 {...P} />,
    landmark:   <Landmark {...P} />,
    nav:        <Navigation {...P} />,
    home:       <Home {...P} />,
    badge:      <BadgeCheck {...P} />,
  };
  return <>{icons[name] ?? <Tag {...P} />}</>;
};

/* ─────────────────────────────────────────────────────────────
   SPEC TABLE RENDERER
───────────────────────────────────────────────────────────── */
interface SpecRow {
  icon: string;
  label: string;
  value: string;
  amber?: boolean;
  bold?: boolean;
}

const SpecTable = ({ rows, title }: { rows: SpecRow[]; title: string }) => (
  <div className="bg-white border border-neutral-200 shadow-sm text-[11px] font-sans overflow-hidden">
    {rows.map(({ icon, label, value, amber, bold }, i) => (
      <div
        key={label}
        className={`flex items-start justify-between px-4 py-3.5 hover:bg-neutral-50/70 transition-colors ${i < rows.length - 1 ? 'border-b border-neutral-100' : ''}`}
      >
        {/* Label */}
        <div className="flex items-center gap-2.5 w-[44%] shrink-0 min-w-0">
          <SpecIcon name={icon} />
          <span className="text-[10.5px] font-semibold tracking-wider uppercase text-neutral-500 leading-tight">
            {label}
          </span>
        </div>
        {/* Value */}
        <div className={`text-right text-[11.5px] leading-snug w-[56%] ${bold ? 'font-bold text-neutral-900' : amber ? 'font-semibold text-amber-600' : 'font-normal text-neutral-800'}`}>
          {value}
        </div>
      </div>
    ))}
    {/* Download button */}
    <div className="bg-neutral-950 text-white px-4 py-3.5 text-center cursor-pointer hover:bg-neutral-800 transition-colors">
      <button className="inline-flex items-center justify-center gap-2 text-[10px] font-bold tracking-widest uppercase w-full">
        <Download size={12} strokeWidth={2.5} /> DOWNLOAD SITE PLAN BLUEPRINT (PDF)
      </button>
    </div>
  </div>
);

/* ─────────────────────────────────────────────────────────────
   AMENITY ICON MAP
───────────────────────────────────────────────────────────── */
const A = { strokeWidth: 1.2, className: 'text-neutral-600' };

const AMENITY_ICONS: Record<string, (s: number) => React.ReactNode> = {
  park:       s => <Trees      size={s} {...A} />,
  school:     s => <GraduationCap size={s} {...A} />,
  hospital:   s => <HeartPulse size={s} {...A} />,
  highway:    s => <Route      size={s} {...A} />,
  train:      s => <Train      size={s} {...A} />,
  bus:        s => <Bus        size={s} {...A} />,
  pool:       s => <Waves      size={s} {...A} />,
  gym:        s => <Dumbbell   size={s} {...A} />,
  cctv:       s => <Camera     size={s} {...A} />,
  garden:     s => <Leaf       size={s} {...A} />,
  phone:      s => <Phone      size={s} {...A} />,
  generator:  s => <Zap        size={s} {...A} />,
  security:   s => <Shield     size={s} {...A} />,
  parking:    s => <Car        size={s} {...A} />,
  shopping:   s => <ShoppingBag size={s} {...A} />,
  wifi:       s => <Wifi       size={s} {...A} />,
  home:       s => <Home       size={s} {...A} />,
  users:      s => <Users      size={s} {...A} />,
  sun:        s => <Sun        size={s} {...A} />,
  fence:      s => <Lock       size={s} {...A} />,
  map:        s => <Map        size={s} {...A} />,
  hammer:     s => <Hammer     size={s} {...A} />,
  layers:     s => <Layers     size={s} {...A} />,
  drill:      s => <Wrench     size={s} {...A} />,
  building:   s => <Building2  size={s} {...A} />,
  navigation: s => <Navigation size={s} {...A} />,
};

/* AmenityGrid — dark card variant for sticky sidebar */
function AmenityGrid({ items, iconSize = 26 }: { items: Array<{icon: string; label: string}>; iconSize?: number }) {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? items : items.slice(0, 9);
  const hasMore = items.length > 9;

  return (
    <div>
      <div className="grid grid-cols-3 border-l border-t border-neutral-800">
        {visible.map(({ icon, label }, i) => (
          <div
            key={i}
            className="flex flex-col items-center justify-center gap-1.5 py-3.5 px-1 border-b border-r border-neutral-800 hover:bg-neutral-900/80 transition-colors cursor-default"
          >
            {(AMENITY_ICONS[icon] ?? AMENITY_ICONS['home'])(iconSize)}
            <span className="text-[9px] text-neutral-400 text-center leading-tight font-medium tracking-wide">
              {label}
            </span>
          </div>
        ))}
      </div>
      {hasMore && !showAll && (
        <button
          onClick={() => setShowAll(true)}
          className="w-full py-2.5 text-[9px] font-black tracking-widest uppercase text-neutral-500 hover:text-amber-400 border-t border-neutral-800 transition-colors"
        >
          LOAD MORE
        </button>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   DATA
───────────────────────────────────────────────────────────── */
const ALL_PROPERTY_LISTINGS = [

  /* ══════════════ BUYING HOUSES ══════════════ */
  {
    id: 'buy-house-1',
    category: 'Buying Houses',
    title: 'Verdancia Estate Residences',
    location: 'GRA PHASE 2, PORT HARCOURT',
    tagline: 'A luxury low-rise master community combining modern townhouses, elegant duplex homes, and premium villas within a secure, high-tier serene residential enclave.',
    image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1600&q=80',

    /* Spec table — buying a house: structure, size, unit count, style */
    specTable: [
      { icon: 'tag',      label: 'STATUS',              value: 'Completed — Move-In Ready',                            bold: true },
      { icon: 'building', label: 'CLASSIFICATION',      value: 'Low-Rise Gated Residential Estate' },
      { icon: 'banknote', label: 'PRICE',               value: '₦ 350,000,000 Onwards',                               bold: true },
      { icon: 'hash',     label: 'TOTAL UNITS',         value: '720+' },
      { icon: 'check',    label: 'AVAILABLE UNITS',     value: '550 Units Remaining',                                 amber: true },
      { icon: 'building', label: 'BUILDINGS BREAKDOWN', value: '18 Townhouses, 10 Villas, 12 Duplexes' },
      { icon: 'bed',      label: 'BEDS',                value: '2 – 6 Bedrooms' },
      { icon: 'droplet',  label: 'BATHROOMS',           value: '3 – 5 Bathrooms' },
      { icon: 'layers',   label: 'FLOORS',              value: 'G + 1 / G + 2' },
      { icon: 'maximize', label: 'UNIT SIZE',           value: '1,450 – 6,200 Sq Ft' },
      { icon: 'map',      label: 'ESTATE FOOTPRINT',    value: '620,000 Sq Ft Gated Community' },
      { icon: 'car',      label: 'PARKING',             value: 'Private 3-Car Carport + Community Visitor Slots' },
      { icon: 'brush',    label: 'MATERIAL / STYLE',    value: 'Fair Face Concrete + Porcelain Strips + Hardwood Accents' },
      { icon: 'pin',      label: 'ADDRESS',             value: 'Plot 14, Off Tombia Street Extension, GRA Phase 2, Port Harcourt' },
      { icon: 'calendar', label: 'CONSTRUCTION START',  value: '2021' },
      { icon: 'key',      label: 'HANDOVER',            value: '2025 — Complete',                                     bold: true },
    ] as SpecRow[],

    overviewBullets: [
      'Located in the ultra-premium, quiet residential core of GRA Phase 2 with proximity to top-tier fine dining, business lounges, and premium fitness hubs.',
      'Engineered with an independent, deep-channeled industrial drainage network directly connected to regional discharge channels to ensure 100% flood-free access.',
      'Equipped with a dedicated 500kVA estate injection transformer backed by an alternate centralized silent generator farm on an optimized load-sharing system.',
      'State-of-the-art clean water treatment plant utilizing multi-stage reverse osmosis filtration with high-capacity overhead storage tanks serving all units uniformly.',
    ],
    amenities: ['24/7 Armed Estate Security','Executive Swimming Pool','Paved Interlocked Jogging Tracks','Dedicated Power Substation','Industrial Water Treatment','Fully Equipped Gym'],
    gallery: [
      'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80',
      'https://images.unsplash.com/photo-1567684014761-b65e2e3b9901?w=800&q=80',
    ],
    propertyCategory: 'Verdancia Estate is a freehold residential master community available for outright purchase. It falls within the premium gated low-rise residential classification — offering townhouses, duplexes, and villas on full C of O-backed titles, targeted at high-net-worth homebuyers and long-term property investors seeking capital growth.',
    unitTypes: [
      { type: '2 Bedroom Townhouse', beds: '2', sizeRange: '1,650 – 2,180 SQ FT' },
      { type: '3 Bedroom Townhouse', beds: '3', sizeRange: '2,250 – 2,980 SQ FT' },
      { type: '4 Bedroom Townhouse', beds: '4', sizeRange: '2,950 – 3,600 SQ FT' },
      { type: '2 Bedroom Duplex',    beds: '2', sizeRange: '1,820 – 2,450 SQ FT' },
      { type: '3 Bedroom Duplex',    beds: '3', sizeRange: '2,500 – 3,100 SQ FT' },
      { type: '3 Bedroom Villa',     beds: '3', sizeRange: '3,200 – 4,000 SQ FT' },
      { type: '4 Bedroom Villa',     beds: '4', sizeRange: '3,950 – 5,200 SQ FT' },
      { type: '5–6 Bedroom Villa (Premium)', beds: '5–6', sizeRange: '4,800 – 7,200 SQ FT' },
    ],
    sizeSummary: [
      { category: 'Townhouses',    smallest: '1,650', largest: '3,600' },
      { category: 'Duplex Homes', smallest: '1,820', largest: '3,100' },
      { category: 'Villas',       smallest: '3,200', largest: '7,200' },
    ],
    projectInfo: [
      { feature: 'Price',           details: '₦ 350,000,000 Onwards' },
      { feature: 'Property Type',   details: 'Low-Rise Gated Residential Estate' },
      { feature: 'Ownership',       details: 'Freehold — Full C of O Backed' },
      { feature: 'Status',          details: 'Completed — Move-In Ready' },
      { feature: 'Developer',       details: 'Verdancia Development Corp.' },
      { feature: 'Plot Area',       details: '620,000 Sq Ft' },
      { feature: 'Building Height', details: 'G + 1 to G + 2' },
      { feature: 'Total Units',     details: '720+ (550 Available)' },
    ],
    projectFeatures: {
      architectural: ['Modern façades with premium Italian porcelain facing strips','Private elevated terraces and balconies on upper floors','High-quality exterior composite cladding systems','Open layouts with floor-to-ceiling light penetration windows','Landscaped pedestrian boulevard walkways'],
      interior:      ['Open-plan chef kitchen with island cabinetry and marble tops','Built-in floor-to-ceiling wardrobe systems in all bedrooms','Premium sanitaryware and Corian countertop surfaces','Smart home pre-wiring for full automation integration','Engineered hardwood flooring across all habitation zones'],
      community:     ['Central curated tropical park with landscaped greenways','Private jogging and cycling circuit track','Shaded childrens multipurpose activity zones','Outdoor seating gardens and community pavilions','Fully interlocked pedestrian-priority internal road network'],
    },
    locationHighlights: {
      connectivity: ['6 minutes to Port Harcourt International Airport','8 minutes to Trans-Amadi industrial and commercial hub','4 minutes to top-tier private schools','Direct access to East-West Road corridor','Close to NLNG, SPDC and major oil company HQs'],
      lifestyle:    ['Premium restaurants and fine dining within 2km','Upscale retail and shopping malls within walking distance','International hospital facilities nearby','Premium fitness clubs and wellness spas nearby','Diplomatic zone within 5 minutes drive'],
    },
    facilitiesTable: [
      { type: 'Recreation', details: 'Executive swimming pool & leisure decking' },
      { type: 'Fitness',    details: 'Fully equipped private gymnasium block' },
      { type: 'Family',     details: "Children's play zones, family picnic parks" },
      { type: 'Security',   details: 'Armed guards + biometric dual-entry gate' },
      { type: 'Power',      details: '500kVA injection transformer + generator farm' },
      { type: 'Water',      details: 'Multi-stage reverse osmosis treatment plant' },
      { type: 'Roads',      details: 'Interlocked paving, engineered drainage channels' },
      { type: 'Waste',      details: 'Managed refuse compaction & collection' },
    ],
    benefits: {
      residents: ['Spacious low-rise layouts with private outdoor spaces','Low-density design guaranteeing full residential privacy','Completely independent infrastructure — no reliance on public utilities','24/7 security framework with multiple deterrent layers'],
      investors: ['GRA Phase 2 corridor delivers 10–15% annual capital appreciation','Estimated rental yield of 8–12% annually on purchase value','Flood-free engineering certification increases insurability and resale','Strong HOA framework protecting long-term asset quality'],
    },
    paymentPlan: [
      { phase: 'Initial Commitment',  amount: '30%', milestone: 'Reservation & Contract Execution' },
      { phase: 'Construction Phase 1', amount: '25%', milestone: 'Foundation & Ground Floor Slab' },
      { phase: 'Construction Phase 2', amount: '25%', milestone: 'Structural Frame & Roofing' },
      { phase: 'Final Balance',        amount: '20%', milestone: 'Keys, Deed & Site Handover' },
    ],
    constructionProgress: [
      { work: 'Foundation & Substructure', status: 'Complete' },
      { work: 'Structural Frame',          status: 'Complete' },
      { work: 'Roofing & Waterproofing',  status: 'Complete' },
      { work: 'Electrical Installation',  status: 'Complete' },
      { work: 'Plumbing & Drainage',      status: 'Complete' },
      { work: 'Tiling & Flooring',        status: 'Complete' },
      { work: 'Interior Finishing',       status: 'Complete' },
      { work: 'External Landscaping',     status: 'Complete' },
      { work: 'Security & Gate Systems',  status: 'Complete — Active' },
      { work: 'Utility Connections',      status: 'Complete — Live' },
      { work: 'Handover Preparation',     status: 'Complete — Keys Issued' },
    ],
    conclusion: "Verdancia Estate Residences stands as Port Harcourt's finest master-planned low-rise community — a refined blend of premium townhouses, duplex homes, and exclusive villas. With exceptional architectural design, fully independent infrastructure, and immaculate finishing, this estate delivers unmatched long-term value for discerning homebuyers and strategic property investors alike.",
    amenityIcons: [
      { icon: 'park',      label: 'Landscaped Park' },
      { icon: 'pool',      label: 'Swimming Pool' },
      { icon: 'gym',       label: 'Private Gym' },
      { icon: 'generator', label: 'Generator Backup' },
      { icon: 'cctv',      label: 'CCTV Security' },
      { icon: 'security',  label: '24/7 Security' },
      { icon: 'parking',   label: 'Parking Bays' },
      { icon: 'garden',    label: 'Private Garden' },
      { icon: 'school',    label: 'School Nearby' },
      { icon: 'hospital',  label: 'Hospital Nearby' },
      { icon: 'shopping',  label: 'Shopping Mall' },
      { icon: 'wifi',      label: 'Fiber Optic' },
    ],
  },

  /* ══════════════ SELLING HOUSES ══════════════ */
  {
    id: 'sell-house-1',
    category: 'Selling Houses',
    title: 'Aura Premium Mansions',
    location: 'PETER ODILI ROAD, PORT HARCOURT',
    tagline: 'High-end structural statement mansions built for executive permanence, balancing massive structural glass views with maximum modern security integration.',
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1600&q=80',

    /* Spec table — selling a house: construction-specific info */
    specTable: [
      { icon: 'tag',      label: 'STATUS',              value: 'Under Construction — Structural Frame Complete', bold: true },
      { icon: 'building', label: 'CLASSIFICATION',      value: 'Ultra-Premium Detached Mansions & Villas' },
      { icon: 'banknote', label: 'SALE PRICE',          value: '₦ 650,000,000 Onwards',                        bold: true },
      { icon: 'hash',     label: 'TOTAL UNITS',         value: '140 Mansions Total' },
      { icon: 'check',    label: 'AVAILABLE UNITS',     value: '42 Remaining — Act Fast',                      amber: true },
      { icon: 'building', label: 'ESTATE LAYOUT',       value: '40 Mansions + 100 Elite Villas' },
      { icon: 'bed',      label: 'BEDS',                value: '4 – 7 Bedrooms' },
      { icon: 'droplet',  label: 'BATHROOMS',           value: '5 – 8 Bathrooms' },
      { icon: 'layers',   label: 'FLOORS',              value: 'G + 2 (Ground + 2 Upper Levels)' },
      { icon: 'maximize', label: 'UNIT SIZE',           value: '3,200 – 8,500 Sq Ft Per Mansion' },
      { icon: 'map',      label: 'TOTAL PLOT AREA',     value: '450,000 Sq Ft' },
      { icon: 'car',      label: 'PARKING',             value: 'Integrated 4-Car Automated Garage Per Unit' },
      { icon: 'brush',    label: 'MATERIAL / STYLE',    value: 'Graphite Coating + Italian Marble + Oak Timber Panels' },
      { icon: 'pin',      label: 'ADDRESS',             value: 'Block B, Aura Haven Estate, Off Peter Odili Road, Port Harcourt' },
      { icon: 'calendar', label: 'CONSTRUCTION START',  value: '2023' },
      { icon: 'key',      label: 'PROJECTED HANDOVER',  value: '2027 — Off-Plan Purchase Available',           bold: true },
    ] as SpecRow[],

    overviewBullets: [
      'Perfectly positioned along the fast-developing Peter Odili Road economic corridor with rapid access to the Trans-Amadi Industrial Layout and corporate offices.',
      'Features high-reinforced structural perimeter walls integrated with an active shock-pulsing electric fencing system and dual-tier biometric access gates.',
      'Smart home automation frameworks preset to tie lighting, VRF central air conditioning, and internal security systems to secure mobile control networks.',
      'High-grade structural concrete foundation engineered with advanced sub-surface damp-proofing and premium grade-beams built to exceed local soil conditions.',
    ],
    amenities: ['Automated Smart Home Hub','Private Access Roads','Infinity Edge Pool','Underground Utility Cabling','High-Density Security Mesh','Exclusive Resident Lounge'],
    gallery: [
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80',
      'https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?w=800&q=80',
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80',
    ],
    propertyCategory: 'Aura Premium Mansions is a freehold ultra-premium detached residential development for outright purchase. It falls within the exclusive trophy asset category, targeting ultra-high-net-worth individuals seeking permanent, statement-level residential structures with institutional-grade security and smart home integration.',
    unitTypes: [
      { type: '4 Bedroom Executive Mansion', beds: '4', sizeRange: '3,200 – 4,500 SQ FT' },
      { type: '5 Bedroom Grand Mansion',     beds: '5', sizeRange: '4,500 – 5,800 SQ FT' },
      { type: '6 Bedroom Signature Villa',   beds: '6', sizeRange: '5,800 – 7,200 SQ FT' },
      { type: '7 Bedroom Ultra-Premium Estate', beds: '7', sizeRange: '7,200 – 8,500 SQ FT' },
    ],
    sizeSummary: [
      { category: 'Executive Mansions',    smallest: '3,200', largest: '5,800' },
      { category: 'Signature Villas',      smallest: '5,800', largest: '7,200' },
      { category: 'Ultra-Premium Estates', smallest: '7,200', largest: '8,500' },
    ],
    projectInfo: [
      { feature: 'Sale Price',      details: '₦ 650,000,000 Onwards' },
      { feature: 'Property Type',   details: 'Ultra-Premium Detached Mansions' },
      { feature: 'Ownership',       details: 'Freehold — Deed of Assignment' },
      { feature: 'Status',          details: 'Under Construction — Frame Complete' },
      { feature: 'Developer',       details: 'Aura Real Estate Developments' },
      { feature: 'Total Plot Area', details: '450,000 Sq Ft' },
      { feature: 'Building Height', details: 'G + 2' },
      { feature: 'Total Units',     details: '140 (42 Remaining)' },
    ],
    projectFeatures: {
      architectural: ['Reinforced graphite-coated exterior façade panels','Structural glass curtain wall systems with maximum light integration','Italian imported marble flooring throughout all primary areas','Automated roller gate and biometric vehicle access systems','Premium oak timber accent panels on feature walls and stairwells'],
      interior:      ['Smart home automation wired to all high-load appliances','VRF multi-zone central air conditioning with mobile control','Floor-to-ceiling panoramic window systems in main living quarters','Chef-grade kitchen infrastructure with imported cabinetry','Spa-caliber en-suite bathrooms with chromotherapy shower systems'],
      community:     ['Infinity edge pool with panoramic residential skyline views','Dedicated private access internal road network for residents only','Underground utility cabling eliminating all above-ground infrastructure','Exclusive residents lounge and private concierge service','Heavy-duty perimeter mesh with active shock-pulse deterrent fencing'],
    },
    locationHighlights: {
      connectivity: ['Immediate adjacency to NLNG gate for oil sector professionals','Direct road axis to Port Harcourt main arterial commercial ring','Less than 10 minutes to Trans-Amadi industrial cluster','Proximity to Port Harcourt City Hall and government institutional belt','Fast access to Ikwerre Road and the main expressway interchange'],
      lifestyle:    ['Exclusive fine dining and private club facilities within 3km','International-grade private hospital infrastructure nearby','Top-tier private schools and international campuses nearby','Business hotels and executive accommodation in vicinity','Active commercial corridor along Peter Odili Road'],
    },
    facilitiesTable: [
      { type: 'Pool',        details: 'Infinity edge resort-style pool and sun deck' },
      { type: 'Smart Tech',  details: 'Full smart home automation throughout' },
      { type: 'Security',    details: 'Dual biometric gate + active electric perimeter mesh' },
      { type: 'Power',       details: 'Underground cabling + dedicated generator infrastructure' },
      { type: 'Parking',     details: 'Integrated 4-car automated garage system per unit' },
      { type: 'Lounge',      details: 'Exclusive resident lounge and concierge block' },
      { type: 'CCTV',        details: 'Full 1080p IP camera network across all zones' },
      { type: 'Roads',       details: 'Private tarmac road network sealed within estate' },
    ],
    benefits: {
      residents: ['Statement-level architectural design expressing elite residential status','Full smart home integration for complete lifestyle automation','Private roads and gates guaranteeing exclusive residential access','Spa-grade interiors reducing need for external lifestyle services'],
      investors: ['Peter Odili Road projected highest appreciation corridor in PHC','Ultra-limited supply of 140 units creates strong scarcity premium','Oil sector captive rental market guarantees above-market lease yields','Smart home infrastructure commands 20–30% premium on resale'],
    },
    paymentPlan: [
      { phase: 'Reservation Deposit', amount: '25%', milestone: 'Site Registration & Contract Sign' },
      { phase: 'Structural Phase',    amount: '30%', milestone: 'Foundation to Frame Milestone' },
      { phase: 'Finishing Phase',     amount: '30%', milestone: 'MEP, Interiors & Smart Systems' },
      { phase: 'Handover Balance',    amount: '15%', milestone: 'Keys, Deed & Utility Connections' },
    ],
    constructionProgress: [
      { work: 'Foundation & Substructure', status: 'Complete' },
      { work: 'Structural Frame',          status: 'Complete' },
      { work: 'Roofing',                   status: '70% — In Active Progress' },
      { work: 'Electrical Installation',   status: '25% — Started on Lower Floors' },
      { work: 'Plumbing & Drainage',       status: 'Vertical stacks up to 6th floor complete' },
      { work: 'HVAC Ducting',              status: 'Lower floors complete; upper floors 30%' },
      { work: 'Window & Frame',            status: 'Preparation complete; installation pending' },
      { work: 'Tiling & Flooring',         status: 'Mock-up approved; material delivery ongoing' },
      { work: 'Waterproofing',             status: 'Podium 70% complete; wet areas ongoing' },
      { work: 'Smart Home Wiring',         status: 'Conduit pre-lay started on Floors 1–3' },
      { work: 'Handover Preparation',      status: 'Not started — documentation phase pending' },
    ],
    conclusion: "Aura Premium Mansions represents the absolute zenith of Port Harcourt residential development — an unprecedented fusion of ultra-luxury architecture, advanced security, and smart-home intelligence. For buyers who accept nothing less than the finest, Aura delivers a permanent, statement-level living asset that will appreciate in both monetary and lifestyle value for decades to come.",
    amenityIcons: [
      { icon: 'pool',      label: 'Infinity Pool' },
      { icon: 'home',      label: 'Smart Home' },
      { icon: 'gym',       label: 'Private Gym' },
      { icon: 'security',  label: '24/7 Security' },
      { icon: 'cctv',      label: 'CCTV Network' },
      { icon: 'parking',   label: 'Automated Garage' },
      { icon: 'generator', label: 'Generator Backup' },
      { icon: 'garden',    label: 'Private Garden' },
      { icon: 'wifi',      label: 'Smart Wiring' },
      { icon: 'fence',     label: 'Electric Fence' },
      { icon: 'users',     label: 'Concierge' },
      { icon: 'sun',       label: 'Private Terrace' },
    ],
  },

  /* ══════════════ SELLING LANDS ══════════════ */
  {
    id: 'sell-land-1',
    category: 'Selling Lands',
    title: 'Trans-Amadi Commercial Block',
    location: 'TRANS-AMADI, PORT HARCOURT',
    tagline: 'Zoned high-density commercial land plots cleared for immediate industrial deployment, corporate headquarters, or premium warehouse facility logistics.',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1600&q=80',

    /* Spec table — LAND: no beds, baths, parking, floors (residential). Focus on zoning, size, title, terrain */
    specTable: [
      { icon: 'tag',      label: 'LAND TYPE',          value: 'Commercial / Industrial Plot',                       bold: true },
      { icon: 'landmark', label: 'ZONING CLASS',       value: 'Class A Industrial — High-Density Commercial' },
      { icon: 'banknote', label: 'ASKING PRICE',       value: '₦ 1,200,000,000 Onwards',                           bold: true },
      { icon: 'hash',     label: 'TOTAL PARCELS',      value: '8 Core Sub-Divisions' },
      { icon: 'check',    label: 'AVAILABLE PARCELS',  value: '2 Sovereign Parcels Remaining',                     amber: true },
      { icon: 'maximize', label: 'COMBINED AREA',      value: '110,000 Sq Ft Total Land Area' },
      { icon: 'maximize', label: 'PARCEL SIZES',       value: '12,500 – 35,000 Sq Ft Per Plot' },
      { icon: 'layers',   label: 'PERMITTED HEIGHT',   value: 'Maximum G + 14 (Government Approved)' },
      { icon: 'file',     label: 'TITLE TYPE',         value: 'Freehold — Verified Certificate of Occupancy' },
      { icon: 'hammer',   label: 'TERRAIN STATUS',     value: 'Bedrock Excavated + 98% Proctor Compacted' },
      { icon: 'zap',      label: 'UTILITIES AT SITE',  value: '33kV Grid Power + Fiber Trunk + Water Points' },
      { icon: 'nav',      label: 'ROAD ACCESS',        value: 'Dual-Lane Heavy Haulage Loop + Expressway Spur' },
      { icon: 'badge',    label: 'ENCUMBRANCE STATUS', value: 'Clean — Registry Certified, No Prior Claims' },
      { icon: 'pin',      label: 'ADDRESS',            value: 'Facility Zone 4, Main Industrial Layout, Trans-Amadi, Port Harcourt' },
      { icon: 'calendar', label: 'SURVEY DATE',        value: '2024 — Fully Certified' },
      { icon: 'key',      label: 'POSSESSION',         value: 'Immediate — Deed Verified & Ready',                 bold: true },
    ] as SpecRow[],

    overviewBullets: [
      "Situated in the absolute heart of Port Harcourt's primary industrial zone, assuring immediate connectivity to major energy, maritime, and commercial logistics networks.",
      'Pre-compacted, heavy-filled solid terrain preparation optimized to effortlessly bear high-load manufacturing plant installations or heavy machinery.',
      'Direct structural linkage to the localized high-voltage 33kV industrial power grid, reducing reliance on low-tier public sector power supply entirely.',
      'Fully verified government documentation including a clean Certificate of Occupancy and certified non-encumbrance status registered at the land registry.',
    ],
    amenities: ['Heavy Duty Truck Loops','Industrial Three-Phase Grid','Direct Expressway Spurs','Fiber Optics Backbone Trunk','High-Output Hydrant System','24/7 Fortified Access Control'],
    gallery: [
      'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&q=80',
      'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?w=800&q=80',
      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80',
    ],
    propertyCategory: 'Trans-Amadi Commercial Block falls within the industrial and commercial land acquisition category. These are sovereign freehold land parcels with verified C of O title, zoned for heavy commercial, industrial, or mixed-use tower development. Targeted at corporate developers, industrial operators, and institutional investors requiring large-footprint operational deployment sites.',
    unitTypes: [
      { type: 'Sub-Division A — Corporate Tower Plot',    beds: 'N/A', sizeRange: '12,500 – 18,000 SQ FT' },
      { type: 'Sub-Division B — Mixed-Use Block',         beds: 'N/A', sizeRange: '18,000 – 25,000 SQ FT' },
      { type: 'Sub-Division C — Industrial Logistics Hub', beds: 'N/A', sizeRange: '25,000 – 35,000 SQ FT' },
    ],
    sizeSummary: [
      { category: 'Corporate Tower Plots', smallest: '12,500', largest: '18,000' },
      { category: 'Mixed-Use Blocks',      smallest: '18,000', largest: '25,000' },
      { category: 'Industrial Parcels',    smallest: '25,000', largest: '35,000' },
    ],
    projectInfo: [
      { feature: 'Price',             details: '₦ 1,200,000,000 Onwards' },
      { feature: 'Land Use Zoning',   details: 'Commercial / Industrial (Class A)' },
      { feature: 'Ownership',         details: 'Freehold — Verified C of O' },
      { feature: 'Status',            details: 'Ready — Immediate Possession' },
      { feature: 'Combined Area',     details: '110,000 Sq Ft Total' },
      { feature: 'Max Height',        details: 'G + 14 (Approved by RSM)' },
      { feature: 'Sub-Divisions',     details: '8 Total (2 Remaining)' },
      { feature: 'Encumbrance Status', details: 'Clean — Registry Certified' },
    ],
    projectFeatures: {
      architectural: ['Pre-graded and compacted to 98% Proctor subgrade density standard','Full bedrock excavation confirming stable high-load foundation platform','Certified land survey with approved boundary markers installed','Drainage outlet spurs pre-configured to storm drain channels','Maximum zoning height of G+14 approved by Rivers State authority'],
      interior:      ['Three-phase 33kV industrial power grid access point at boundary','Fiber optics backbone trunk connection installed at boundary edge','High-output hydrant fire suppression connection point available','Underground utility conduit trenches pre-laid throughout','Secured with fortified perimeter walling and guard booth'],
      community:     ['Shared industrial truck loop access roads maintained by zone HOA','Collective logistics loading bay allocation per sub-division','Coordinated security patrol across the full Trans-Amadi cluster','Heavy plant movement corridors pre-designed into estate roads','Waste management infrastructure serving all commercial sub-divisions'],
    },
    locationHighlights: {
      connectivity: ["Core heart of Trans-Amadi — Port Harcourt's premier industrial zone",'Direct connection to major highways and port logistics arterials','Immediate access to Ordnance Road industrial command cluster','Within minutes of sea port logistics and container terminal','Close proximity to Port Harcourt International Airport cargo zone'],
      lifestyle:    ['Adjacent to major oil company service providers and vendors','Close to banking district and government revenue zones','Surrounded by established industrial and commercial anchor tenants','High vehicle and commercial traffic density — maximum business exposure','Accessible via primary road networks from all sectors of PHC'],
    },
    facilitiesTable: [
      { type: 'Power Grid', details: '33kV three-phase industrial grid access point' },
      { type: 'Fiber',      details: 'Fiber backbone trunk connection at boundary' },
      { type: 'Road Access', details: 'Dual-lane heavy haulage truck access loops' },
      { type: 'Fire Safety', details: 'High-output industrial hydrant connection' },
      { type: 'Security',   details: 'Fortified perimeter walling and 24/7 guard post' },
      { type: 'Drainage',   details: 'Storm drain channel outlets pre-configured' },
      { type: 'Logistics',  details: 'Dedicated loading zones and extra-wide aprons' },
      { type: 'Utilities',  details: 'Pre-laid underground conduit trenches' },
    ],
    benefits: {
      residents: ['Immediate possession with fully verified government title','Clean C of O eliminates all legal due-diligence complications','Pre-compacted terrain reduces initial foundation development cost','Full industrial utility access already available at boundary'],
      investors: ['Trans-Amadi industrial land appreciated 40% over 3 years','Extreme scarcity — only 2 parcels remaining of 8 total','Maximum G+14 zoning provides highest development density in PHC','Certified C of O provides immediate collateral value for financing'],
    },
    paymentPlan: [
      { phase: 'Reservation Hold',      amount: '40%', milestone: 'Title Freeze & Contract Binding' },
      { phase: 'Documentation Phase',   amount: '35%', milestone: 'Deed & Survey Execution' },
      { phase: 'Possession Completion', amount: '25%', milestone: 'Full Key & Registry Transfer' },
    ],
    constructionProgress: [
      { work: 'Site Clearing & Demolition', status: 'Complete' },
      { work: 'Bedrock Excavation',         status: 'Complete' },
      { work: 'Subgrade Compaction',        status: 'Complete — 98% Proctor Verified' },
      { work: 'Boundary Survey & Pegging',  status: 'Complete — Certified' },
      { work: 'Perimeter Fencing',          status: 'Complete — Active' },
      { work: 'Utility Conduit Pre-lay',    status: 'Complete' },
      { work: 'Power Grid Connection',      status: 'Complete — Live 33kV' },
      { work: 'Drainage Channel Config',    status: 'Complete' },
      { work: 'Fiber Trunk Connection',     status: 'Complete — Live' },
      { work: 'Title Registration',         status: 'Complete — Registry Certified' },
      { work: 'Handover Preparation',       status: 'Complete — Immediate Available' },
    ],
    conclusion: "Trans-Amadi Commercial Block represents one of the last available large-footprint, C of O-verified industrial land parcels in Port Harcourt's most strategically positioned commercial zone. With immediate possession, pre-prepared terrain, and full utility access at the boundary, this offering is a rare, time-sensitive acquisition opportunity for visionary commercial developers and institutional landbankers.",
    amenityIcons: [
      { icon: 'generator', label: '33kV Grid Power' },
      { icon: 'wifi',      label: 'Fiber Trunk' },
      { icon: 'navigation',label: 'Road Access' },
      { icon: 'security',  label: '24/7 Guard Post' },
      { icon: 'hammer',    label: 'Compacted Base' },
      { icon: 'drill',     label: 'Bedrock Cleared' },
      { icon: 'map',       label: 'Survey Certified' },
      { icon: 'fence',     label: 'Perimeter Fencing' },
      { icon: 'layers',    label: 'G+14 Zoning' },
      { icon: 'parking',   label: 'Truck Loops' },
      { icon: 'phone',     label: 'Fire Hydrant' },
      { icon: 'building',  label: 'C of O Verified' },
    ],
  },

  /* ══════════════ RENTING HOUSES ══════════════ */
  {
    id: 'rent-house-1',
    category: 'Renting Houses',
    title: 'Woji Luxury Duplexes',
    location: 'WOJI DISTRICT, PORT HARCOURT',
    tagline: 'Modern executive duplex units offering high-end urban lifestyle aesthetics with fast bypass access to both Trans-Amadi and the East-West road corridor.',
    image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1600&q=80',

    /* Spec table — RENTING: focus on lease terms, deposit, rent amount, furnished status, utilities */
    specTable: [
      { icon: 'tag',      label: 'LISTING TYPE',        value: 'Annual Residential Lease',                          bold: true },
      { icon: 'banknote', label: 'ANNUAL RENT',         value: '₦ 12,000,000 Per Year',                            bold: true },
      { icon: 'calendar', label: 'LEASE TERM',          value: '1 Year — Renewable Annually' },
      { icon: 'shield',   label: 'CAUTION DEPOSIT',     value: '10% of Annual Rent (Fully Refundable)' },
      { icon: 'check',    label: 'AVAILABLE UNITS',     value: '5 Lease Slots Currently Open',                     amber: true },
      { icon: 'chart',    label: 'OCCUPANCY RATE',      value: '88.9% — High Residential Demand',                  amber: true },
      { icon: 'bed',      label: 'BEDROOMS',            value: '3 – 5 Bedrooms' },
      { icon: 'droplet',  label: 'BATHROOMS',           value: '4 – 6 Bathrooms' },
      { icon: 'layers',   label: 'FLOORS',              value: 'G + 1 (Duplex Configuration)' },
      { icon: 'maximize', label: 'UNIT SIZE',           value: '2,100 – 4,300 Sq Ft' },
      { icon: 'home',     label: 'FURNISHED STATUS',    value: 'Unfurnished — Fitting-Ready' },
      { icon: 'car',      label: 'PARKING',             value: '2 Paved Allocated Bays Per Unit' },
      { icon: 'zap',      label: 'UTILITIES',           value: 'Prepaid Electricity + 24hr Pumped Water' },
      { icon: 'hash',     label: 'TOTAL UNITS IN ESTATE', value: '45 Units Across 8 Detached Blocks' },
      { icon: 'pin',      label: 'ADDRESS',             value: 'Estate Avenue, Off Woji Road (Near YKC Junction), Port Harcourt' },
      { icon: 'key',      label: 'AVAILABLE FROM',      value: 'Immediate Availability',                           bold: true },
    ] as SpecRow[],

    overviewBullets: [
      'Nestled within an exclusively residential sector of Woji, striking the perfect balance between high-access urban connectivity and a peaceful family neighborhood setting.',
      'Features advanced interior acoustic insulation layers, cutting out exterior urban noise completely for a quiet, premium residential working environment.',
      'The estate features an elevated concrete road infrastructure network engineered with closed drainage systems to defy typical localized seasonal downpours.',
      'Serviced with round-the-clock water pumping stations and a dedicated prepaid card metering system connected to the neighborhood steady power grid.',
    ],
    amenities: ['Secure Perimeter Fencing','Prepaid Electricity Systems','Central Pumping Clean Water','Professional Uniformed Guards','Waste Logistics Service','Paved Neighborhood Access'],
    gallery: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80',
    ],
    propertyCategory: 'Woji Luxury Duplexes falls within the premium annual residential rental category. These are fully completed executive duplex homes available on standard 1-year renewable lease agreements. Targeted at corporate professionals, oil sector workers, and executive families requiring premium, fully-serviced residential accommodation with immediate availability.',
    unitTypes: [
      { type: '3 Bedroom Executive Duplex', beds: '3', sizeRange: '2,100 – 2,800 SQ FT' },
      { type: '4 Bedroom Grand Duplex',     beds: '4', sizeRange: '2,800 – 3,600 SQ FT' },
      { type: '5 Bedroom Premium Duplex',   beds: '5', sizeRange: '3,600 – 4,300 SQ FT' },
    ],
    sizeSummary: [
      { category: 'Executive Units (3BR)', smallest: '2,100', largest: '2,800' },
      { category: 'Grand Units (4BR)',     smallest: '2,800', largest: '3,600' },
      { category: 'Premium Units (5BR)',   smallest: '3,600', largest: '4,300' },
    ],
    projectInfo: [
      { feature: 'Annual Rent',       details: '₦ 12,000,000 / Year' },
      { feature: 'Lease Type',        details: '1-Year Renewable Leasehold' },
      { feature: 'Caution Deposit',   details: '10% (Refundable)' },
      { feature: 'Status',            details: 'Completed — 5 Units Available' },
      { feature: 'Furnished Status',  details: 'Unfurnished — Fitting Ready' },
      { feature: 'Estate Size',       details: '180,000 Sq Ft' },
      { feature: 'Total Units',       details: '45 (5 Open)' },
      { feature: 'Occupancy Rate',    details: '88.9%' },
    ],
    projectFeatures: {
      architectural: ['Brushed steel exterior fixture detailing with smoked safety glass','Reinforced POP ceiling systems providing architectural definition','Dual-entry detached duplex layout ensuring full residential privacy','Elevated concrete road infrastructure with closed drainage systems','Acoustically insulated interior walls and ceilings'],
      interior:      ['Premium fitted kitchen with full tile coverage and quality cabinetry','Smoked glass balcony railings and feature window panels throughout','En-suite bathrooms in all bedrooms with quality sanitaryware','Built-in wardrobe systems configured in all bedroom closets','Prepaid sub-meter electricity configuration per residential unit'],
      community:     ['Uniformed professional security guards on 12-hour rotating patrol','Perimeter block wall fencing with electrified deterrent capping','Twice-weekly waste collection logistics service across the estate','Communal clean water pumping infrastructure on 24-hour schedule','Paved neighborhood road access and parking allocation markers'],
    },
    locationHighlights: {
      connectivity: ['Proximate to Rumuola Junction giving access to three major road arteries','10 minutes to Trans-Amadi industrial layout and logistics corridor','15 minutes to GRA Phase 2 business and commercial district','Easy access to Woji Road heading toward the East-West corridor','20 minutes to Port Harcourt International Airport terminal'],
      lifestyle:    ['Walking distance to Rumuola market and essential retail','Close to several top secondary and private primary institutions','Access to premium restaurants and dining along Woji Road','Pharmacy clusters and health facilities within 5 minutes','Multiple banks, ATM nodes, and financial services nearby'],
    },
    facilitiesTable: [
      { type: 'Security',  details: 'Electrified perimeter wall + uniformed guards' },
      { type: 'Power',     details: 'Prepaid sub-meter electricity per unit' },
      { type: 'Water',     details: '24-hour communal pumping station supply' },
      { type: 'Parking',   details: '2 paved allocated bays per unit' },
      { type: 'Roads',     details: 'Elevated concrete internal access road' },
      { type: 'Drainage',  details: 'Closed-loop drainage systems' },
      { type: 'Waste',     details: 'Twice-weekly scheduled collection' },
      { type: 'Acoustics', details: 'Full interior acoustic insulation' },
    ],
    benefits: {
      residents: ['Acoustic engineering eliminates neighborhood noise completely','Prepaid metering removes landlord billing complications','Fully finished and immediately habitable — no fit-out required','Estate maintained by HOA ensuring consistent quality'],
      investors: ['88.9% occupancy rate signals exceptional demand reliability','Annual lease renewals protect against market vacancy risk','Low maintenance burden — HOA manages all common area upkeep','Woji district rental yields averaging 9–11% annually'],
    },
    paymentPlan: [
      { phase: 'Annual Lease Upfront',   amount: '100%',       milestone: 'Full Year Lease Activation' },
      { phase: '6-Month Split Option',   amount: '60% / 40%',  milestone: 'First & Second Half Intervals' },
      { phase: 'Caution Deposit',        amount: '10%',        milestone: 'Refundable on Lease Termination' },
    ],
    constructionProgress: [
      { work: 'Foundation & Substructure', status: 'Complete' },
      { work: 'Structural Frame',          status: 'Complete' },
      { work: 'Roofing & Waterproofing',  status: 'Complete' },
      { work: 'Electrical Installation',  status: 'Complete' },
      { work: 'Plumbing & Drainage',      status: 'Complete' },
      { work: 'Tiling & Flooring',        status: 'Complete' },
      { work: 'Interior Finishing',       status: 'Complete' },
      { work: 'External Landscaping',     status: 'Complete' },
      { work: 'Security Systems',         status: 'Complete — Active' },
      { work: 'Utility Connections',      status: 'Complete — Live' },
      { work: 'Lease Management',         status: 'Active — 5 Units Open' },
    ],
    conclusion: "Woji Luxury Duplexes offers the perfect intersection of premium residential quality, urban connectivity, and infrastructure independence in one of Port Harcourt's most accessible districts. With only 5 lease slots remaining, this is an immediate-action opportunity for executives and professionals seeking top-tier accommodation without the friction and uncertainty of the open market.",
    amenityIcons: [
      { icon: 'security',  label: 'Security Guards' },
      { icon: 'generator', label: 'Generator Backup' },
      { icon: 'parking',   label: '2 Parking Bays' },
      { icon: 'cctv',      label: 'CCTV Security' },
      { icon: 'garden',    label: 'Private Garden' },
      { icon: 'sun',       label: 'Private Balcony' },
      { icon: 'wifi',      label: 'Prepaid Electricity' },
      { icon: 'phone',     label: 'Intercom' },
      { icon: 'school',    label: 'School Nearby' },
      { icon: 'hospital',  label: 'Clinic Nearby' },
      { icon: 'shopping',  label: 'Market Nearby' },
      { icon: 'bus',       label: 'Transport Access' },
    ],
  },

  /* ══════════════ LEASING APARTMENTS ══════════════ */
  {
    id: 'lease-apt-1',
    category: 'Leasing Apartments',
    title: 'Ada-George Corporate Flats',
    location: 'ADA-GEORGE ROAD, PORT HARCOURT',
    tagline: 'Highly responsive urban apartments optimized for corporate professionals, business proxies, and compact family structures seeking top-tier infrastructure links.',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1600&q=80',

    /* Spec table — LEASING APARTMENTS: lease-specific fields, floor info, occupancy, deposit */
    specTable: [
      { icon: 'tag',      label: 'LISTING TYPE',         value: 'Structured Annual Apartment Lease',                  bold: true },
      { icon: 'banknote', label: 'ANNUAL LEASE',         value: '₦ 7,500,000 Per Year',                              bold: true },
      { icon: 'calendar', label: 'LEASE STRUCTURE',      value: 'Full Annual or Bi-Annual Split (55% / 45%)' },
      { icon: 'shield',   label: 'SECURITY DEPOSIT',     value: '10% Caution — Fully Refundable on Exit' },
      { icon: 'check',    label: 'AVAILABLE UNITS',      value: '14 of 310 Currently Open',                          amber: true },
      { icon: 'chart',    label: 'OCCUPANCY RATE',       value: '95.5% — Extremely High Demand',                     amber: true },
      { icon: 'bed',      label: 'BEDROOMS',             value: '1 – 3 Bedrooms' },
      { icon: 'droplet',  label: 'BATHROOMS',            value: '2 – 3 Bathrooms' },
      { icon: 'layers',   label: 'FLOORS AVAILABLE',     value: 'Levels 1 Through 4 (4-Tower Complex)' },
      { icon: 'maximize', label: 'UNIT SIZE',            value: '950 – 1,850 Sq Ft' },
      { icon: 'home',     label: 'FURNISHED STATUS',     value: 'Unfurnished — Move-In Ready' },
      { icon: 'car',      label: 'PARKING',              value: 'Card-Access Gated Vehicle Loop System' },
      { icon: 'zap',      label: 'UTILITIES STATUS',     value: 'Prepaid Electricity + Multi-Pump Water Supply' },
      { icon: 'building', label: 'COMPLEX SIZE',         value: '290,000 Sq Ft Across 4 Monolithic Towers' },
      { icon: 'pin',      label: 'ADDRESS',              value: 'Cruise Drive, Off Ada-George Road Flight Avenue, Port Harcourt' },
      { icon: 'key',      label: 'AVAILABLE FROM',       value: 'Within 7 Working Days of Lease Sign',               bold: true },
    ] as SpecRow[],

    overviewBullets: [
      'Perfectly located on the expansive, dual-carriageway Ada-George network, guaranteeing super-fast transit access to Wimpey, Ikwerre Road, and airport connection routes.',
      'Equipped with 24-hour centralized power backup run on a dual multi-tier industrial diesel generator farm with automated sound-attenuated enclosures.',
      'Features a fortified ballistic security post at the main entryway with comprehensive 1080p smart IP CCTV cameras monitoring all inner layout vectors.',
      'Includes access to a modern community management desk handling routine refuse collection, external cleaning, electrical calls, and plumbing maintenance.',
    ],
    amenities: ['Redundant Backup Power','Fortified Entrance Gate','Continuous IP CCTV Loops','Ballistic Screen Outer Gate','Executive Concierge Track','On-Site Maintenance Team'],
    gallery: [
      'https://images.unsplash.com/photo-1502672023488-70e25813eb80?w=800&q=80',
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&q=80',
      'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800&q=80',
    ],
    propertyCategory: 'Ada-George Corporate Flats falls within the structured corporate apartment leasing category. These are modern residential apartment units within a purpose-built multi-tower complex, available on annual renewable lease agreements. Targeted at corporate tenants, business professionals, and compact family structures requiring secure, infrastructure-rich urban accommodation.',
    unitTypes: [
      { type: '1 Bedroom Corporate Flat',  beds: '1', sizeRange: '950 – 1,150 SQ FT' },
      { type: '2 Bedroom Corporate Flat',  beds: '2', sizeRange: '1,150 – 1,500 SQ FT' },
      { type: '3 Bedroom Executive Flat',  beds: '3', sizeRange: '1,500 – 1,850 SQ FT' },
    ],
    sizeSummary: [
      { category: '1 Bedroom Units', smallest: '950',   largest: '1,150' },
      { category: '2 Bedroom Units', smallest: '1,150', largest: '1,500' },
      { category: '3 Bedroom Units', smallest: '1,500', largest: '1,850' },
    ],
    projectInfo: [
      { feature: 'Annual Lease',      details: '₦ 7,500,000 / Year' },
      { feature: 'Lease Structure',   details: 'Annual or Bi-Annual Split' },
      { feature: 'Security Deposit',  details: '10% (Fully Refundable)' },
      { feature: 'Status',            details: 'Completed — 14 Units Available' },
      { feature: 'Complex Size',      details: '290,000 Sq Ft' },
      { feature: 'Floors Available',  details: 'Levels 1 Through 4' },
      { feature: 'Total Units',       details: '310 (14 Currently Open)' },
      { feature: 'Occupancy Rate',    details: '95.5% — Extremely High' },
    ],
    projectFeatures: {
      architectural: ['Micro-cement exterior coating with anti-sulphate protective finish','Stainless steel handrails and premium balcony guard rail systems','Four-tower monolithic structure with central courtyard orientation','Anti-vibration concrete podium design reducing traffic noise ingress','Reinforced rooftop deck with waterproofing membrane and drainage cap'],
      interior:      ['Fully tiled floors and walls throughout all habitation areas','Quality kitchen cabinetry with worktop and appliance space','En-suite bathrooms with modern sanitaryware in all configurations','Built-in wardrobe fittings and dedicated linen storage','Prepaid electricity sub-metering reducing billing disputes'],
      community:     ['Ballistic-rated security screen at main vehicle entrance kiosk','1080p smart IP CCTV network covering all zones within compound','Dual-tier industrial generator farm with auto-transfer switch','Dedicated on-site facility management team for maintenance','Gated card-access vehicle loop system controlling all parking'],
    },
    locationHighlights: {
      connectivity: ['Direct access from Ada-George dual-carriageway arterial corridor','12 minutes to Port Harcourt International Airport via Airport Road','Close to Wimpey Junction giving multi-directional route access','Easy access to Ikwerre Road and Aba Road commercial distribution','Near Ada-George Flight Avenue for cargo logistics access'],
      lifestyle:    ['Multiple supermarkets, pharmacies, and retail outlets within walking zone','Banking institutions and financial services on the main corridor','Access to premium restaurants and local dining nearby','Private clinic facilities and specialist medical services nearby','Schools and learning centres within 5 minutes drive'],
    },
    facilitiesTable: [
      { type: 'Power',      details: 'Dual industrial generator farm with auto-transfer' },
      { type: 'Security',   details: 'Ballistic-rated screen at main entrance kiosk' },
      { type: 'CCTV',       details: '1080p IP camera network across all zones' },
      { type: 'Parking',    details: 'Card-access gated vehicle loop system' },
      { type: 'Concierge',  details: 'Executive community management desk on-site' },
      { type: 'Maintenance', details: 'On-site facility team for all repair calls' },
      { type: 'Water',      details: 'Multi-pump clean water supply infrastructure' },
      { type: 'Waste',      details: 'Scheduled communal refuse collection' },
    ],
    benefits: {
      residents: ['Ada-George corridor offers unmatched transit convenience','Immediate vacancy — move-in within 7 working days','On-site facility management eliminates landlord-response frustrations','Ballistic-rated security — extremely rare in PHC apartment market'],
      investors: ['95.5% occupancy rate — virtually zero vacancy risk','Only 14 of 310 units open — confirms consistent demand strength','Dual generator infrastructure commands 15–20% premium above market','Annual lease renewals create stable, predictable income yield stream'],
    },
    paymentPlan: [
      { phase: 'Annual Lease — Full',  amount: '100%',       milestone: 'Full Year Lease Activation' },
      { phase: 'Bi-Annual Split',      amount: '55% / 45%',  milestone: 'First & Second 6-Month Periods' },
      { phase: 'Caution Deposit',      amount: '10%',        milestone: 'Refundable at Lease Conclusion' },
    ],
    constructionProgress: [
      { work: 'Foundation & Substructure', status: 'Complete' },
      { work: 'Structural Frame',          status: 'Complete' },
      { work: 'Roofing & Waterproofing',  status: 'Complete' },
      { work: 'Electrical Installation',  status: 'Complete' },
      { work: 'Plumbing & Drainage',      status: 'Complete' },
      { work: 'Tiling & Flooring',        status: 'Complete' },
      { work: 'Interior Finishing',       status: 'Complete' },
      { work: 'Security Systems',         status: 'Complete — Active' },
      { work: 'Utility Connections',      status: 'Complete — Live' },
      { work: 'Generator Systems',        status: 'Complete — Active 24/7' },
      { work: 'Lease Management',         status: 'Active — 14 Units Open' },
    ],
    conclusion: "Ada-George Corporate Flats delivers a rare combination of strategic location, robust infrastructure, and institutional-grade security at accessible annual lease pricing. With 95.5% occupancy and only 14 units remaining, this complex consistently outperforms the broader Port Harcourt apartment market — making it the definitive choice for both discerning corporate tenants and yield-focused property investors.",
    amenityIcons: [
      { icon: 'generator', label: 'Dual Generator' },
      { icon: 'security',  label: 'Ballistic Gate' },
      { icon: 'cctv',      label: '1080p CCTV' },
      { icon: 'parking',   label: 'Card Parking' },
      { icon: 'users',     label: 'Concierge' },
      { icon: 'phone',     label: 'Maintenance Team' },
      { icon: 'wifi',      label: 'Prepaid Electricity' },
      { icon: 'highway',   label: 'Highway Access' },
      { icon: 'school',    label: 'Schools Nearby' },
      { icon: 'hospital',  label: 'Clinic Nearby' },
      { icon: 'shopping',  label: 'Retail Nearby' },
      { icon: 'bus',       label: 'Transport Links' },
    ],
  },
];

/* ─────────────────────────────────────────────────────────────
   TOC CONFIG
───────────────────────────────────────────────────────────── */
const TOC_ITEMS = [
  { id: 'sec-overview',   label: 'Overview' },
  { id: 'sec-propcat',    label: 'Property category' },
  { id: 'sec-unittypes',  label: 'Unit types and sizes' },
  { id: 'sec-sizesum',    label: 'At-a-glance size summary' },
  { id: 'sec-projinfo',   label: 'Project information' },
  { id: 'sec-features',   label: 'Project features and residential excellence' },
  { id: 'sec-location',   label: 'Location highlights' },
  { id: 'sec-facilities', label: 'Facilities and amenities' },
  { id: 'sec-benefits',   label: 'Benefits for buyers and investors' },
  { id: 'sec-payment',    label: 'Payment plan' },
  { id: 'sec-construct',  label: 'Construction Progress Update' },
  { id: 'sec-conclusion', label: 'Conclusion' },
];

/* ─────────────────────────────────────────────────────────────
   COMPONENT
───────────────────────────────────────────────────────────── */
export default function RealDevListingSection() {
  const [selectedProperty, setSelectedProperty] = useState<any | null>(null);
  const [formData, setFormData]   = useState({ name: '', phone: '', email: '', message: '' });
  const [activeSection, setActiveSection] = useState('sec-overview');
  const [tocOpen, setTocOpen]     = useState(true);
  const detailRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.style.overflow = selectedProperty ? 'hidden' : 'unset';
    if (selectedProperty) setActiveSection('sec-overview');
    return () => { document.body.style.overflow = 'unset'; };
  }, [selectedProperty]);

  useEffect(() => {
    if (!selectedProperty) return;
    const el = detailRef.current;
    if (!el) return;
    const sections = el.querySelectorAll('[data-sec]');
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) setActiveSection(e.target.getAttribute('data-sec') || ''); }),
      { root: el, rootMargin: '-25% 0px -65% 0px', threshold: 0 }
    );
    sections.forEach(s => obs.observe(s));
    return () => obs.disconnect();
  }, [selectedProperty]);

  const scrollTo = useCallback((id: string) => {
    const el = detailRef.current;
    if (!el) return;
    const target = el.querySelector(`[data-sec="${id}"]`) as HTMLElement;
    if (target) el.scrollTo({ top: target.offsetTop - 100, behavior: 'smooth' });
  }, []);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  /* ── Shared Section Heading (matches reference: clean sans-serif) ── */
  const SH = ({ label }: { label: string }) => (
    <h2 className="text-[22px] font-semibold text-neutral-900 tracking-tight mb-3 leading-snug">{label}</h2>
  );

  /* ── Table renderer ── */
  const DataTable = ({ headers, rows }: { headers: string[]; rows: (string | React.ReactNode)[][] }) => (
    <div className="border border-neutral-200 overflow-hidden text-sm">
      <div className="grid bg-neutral-100 border-b border-neutral-200" style={{ gridTemplateColumns: `repeat(${headers.length}, 1fr)` }}>
        {headers.map(h => <div key={h} className="px-4 py-2.5 text-[11px] font-semibold tracking-wider uppercase text-neutral-600">{h}</div>)}
      </div>
      {rows.map((row, i) => (
        <div key={i} className={`grid border-b border-neutral-100 last:border-0 hover:bg-amber-50/25 ${i % 2 === 0 ? 'bg-white' : 'bg-neutral-50/40'}`}
             style={{ gridTemplateColumns: `repeat(${headers.length}, 1fr)` }}>
          {row.map((cell, j) => (
            <div key={j} className={`px-4 py-2.5 text-[12px] text-neutral-700 ${j === 0 ? 'font-medium' : ''}`}>{cell}</div>
          ))}
        </div>
      ))}
    </div>
  );

  return (
    <div className="bg-[#FAF9F5] text-[#111111] font-sans antialiased w-full relative">

      {/* ══════════════════════════════
          CARD STACK FEED
      ══════════════════════════════ */}
      <div className="relative bg-neutral-950 w-full min-h-screen">
        {ALL_PROPERTY_LISTINGS.map((property, idx) => (
          <div
            key={property.id}
            className="sticky top-0 h-screen w-full overflow-hidden border-b border-neutral-900 bg-neutral-950 group cursor-pointer"
            style={{ zIndex: idx + 1 }}
            onClick={() => setSelectedProperty(property)}
          >
            <div className="absolute inset-0 transform scale-100 group-hover:scale-105 transition-transform duration-[8000ms] ease-out">
              <img src={property.image} alt={property.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-70 transition-opacity duration-700" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-neutral-950/40" />
            <div className="absolute inset-0 flex flex-col justify-between p-8 md:p-12 text-white z-10 select-none">
              <div className="flex justify-between items-start">
                <span className="bg-white text-neutral-950 text-[10px] font-black tracking-widest uppercase px-3 py-1">{property.category}</span>
                <div className="text-right">
                  <p className="text-[9px] tracking-widest text-neutral-400 font-bold uppercase">VALUATION TARGET</p>
                  <p className="text-sm font-mono font-bold text-amber-400">{property.specTable.find((r: SpecRow) => r.icon === 'banknote')?.value ?? ''}</p>
                </div>
              </div>
              <div className="text-center my-auto">
                <h2 className="text-4xl md:text-6xl font-normal tracking-tight text-white drop-shadow-xl max-w-4xl mx-auto">{property.title}</h2>
              </div>
              <div className="flex flex-col md:flex-row justify-between items-center gap-4 border-t border-neutral-800/80 pt-4 bg-neutral-950/30 -mx-12 px-12 pb-2">
                <span className="text-[10px] tracking-widest text-neutral-400 uppercase font-mono">[0{idx+1} / 0{ALL_PROPERTY_LISTINGS.length}]</span>
                <div className="flex items-center gap-4 text-[10px] font-mono tracking-wider uppercase text-neutral-300">
                  <span className="flex items-center gap-1 text-amber-400 font-bold"><MapPin size={11} /> {property.location.split(',')[0]}</span>
                  <span className="text-neutral-700">•</span>
                  <span className="flex items-center gap-1"><Building2 size={11} className="text-neutral-400" /> {property.category}</span>
                </div>
                <span className="inline-flex items-center gap-2 text-[10px] font-black tracking-widest uppercase text-neutral-300 group-hover:text-amber-400 transition-colors">
                  EXPLORATION BLUEPRINT <ArrowRight size={12} className="stroke-[3]" />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ══════════════════════════════
          DETAIL OVERLAY
      ══════════════════════════════ */}
      {selectedProperty && (
        <div ref={detailRef} className="fixed inset-0 z-[99999] bg-[#FAF9F6] overflow-y-auto">

          {/* ── HERO ── */}
          <div className="relative w-full h-[60vh] md:h-[72vh] bg-neutral-950 overflow-hidden">
            <img src={selectedProperty.image} alt={selectedProperty.title} className="w-full h-full object-cover opacity-90" />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent" />
            <div className="absolute top-6 left-6 z-50">
              <button onClick={() => setSelectedProperty(null)}
                className="inline-flex items-center gap-2 bg-neutral-950 text-white border border-neutral-800 px-4 py-2.5 text-xs font-bold tracking-widest uppercase hover:bg-white hover:text-black transition-all shadow-2xl">
                <ArrowLeft size={14} /> Close & Return
              </button>
            </div>
            <div className="absolute bottom-8 left-0 right-0 px-6 md:px-12 z-20">
              <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-end gap-4">
                <div className="space-y-1">
                  <div className="bg-amber-500 text-neutral-950 text-[9px] font-black tracking-widest uppercase px-2 py-0.5 inline-block">
                    {selectedProperty.category.toUpperCase()} // DESIGN BLUEPRINT
                  </div>
                  <h1 className="text-4xl md:text-5xl font-normal tracking-tight text-white drop-shadow-md">{selectedProperty.title}</h1>
                </div>
                <div className="bg-neutral-950/90 border border-neutral-800 p-3.5 text-right">
                  <p className="text-[9px] tracking-widest text-neutral-400 font-mono">VALUATION PROJECTION</p>
                  <p className="text-base font-mono font-bold text-amber-400">{selectedProperty.specTable.find((r: SpecRow) => r.icon === 'banknote')?.value}</p>
                </div>
              </div>
            </div>
          </div>

          {/* ── TAB STRIP ── */}
          <div className="bg-white border-b border-neutral-200 sticky top-0 z-40 overflow-x-auto shadow-sm">
            <div className="max-w-7xl mx-auto px-4 flex">
              {['OVERVIEW','VIDEO','DETAILS','AMENITIES','IMAGES','LOCATION'].map((tab, i) => (
                <button key={i}
                  onClick={() => scrollTo(tab==='OVERVIEW'?'sec-overview':tab==='VIDEO'?'sec-video':tab==='DETAILS'?'sec-unittypes':tab==='AMENITIES'?'sec-facilities':tab==='IMAGES'?'sec-gallery':'sec-map')}
                  className={`py-4 px-5 text-[10px] font-bold tracking-widest uppercase cursor-pointer min-w-[100px] flex-1 text-center transition-colors border-b-2 ${
                    (tab==='OVERVIEW'&&['sec-overview','sec-propcat'].includes(activeSection))||
                    (tab==='VIDEO'&&activeSection==='sec-video')||
                    (tab==='DETAILS'&&['sec-unittypes','sec-sizesum','sec-projinfo','sec-features'].includes(activeSection))||
                    (tab==='AMENITIES'&&['sec-facilities','sec-location','sec-benefits','sec-payment'].includes(activeSection))||
                    (tab==='IMAGES'&&activeSection==='sec-gallery')||
                    (tab==='LOCATION'&&activeSection==='sec-map')
                    ?'text-neutral-900 border-neutral-900':'text-neutral-400 border-transparent hover:text-neutral-700'}`}
                >{tab}</button>
              ))}
            </div>
          </div>

          {/* ── BODY ── */}
          <div className="max-w-7xl mx-auto px-6 md:px-12 bg-[#FAF9F6]">

            {/* SECTION A: Overview text + Category-specific Spec Table */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 py-14 border-b border-neutral-200">
              <div className="lg:col-span-5 flex flex-col justify-center">
                <p className="text-[10px] font-bold tracking-widest uppercase text-amber-500 font-mono mb-3">{selectedProperty.category.toUpperCase()} // OVERVIEW</p>
                <p className="text-neutral-700 leading-relaxed text-base md:text-[17px] font-light mb-4">{selectedProperty.tagline}</p>
                <p className="text-neutral-500 text-sm leading-relaxed font-light">{selectedProperty.overviewBullets[0]}</p>
              </div>
              <div className="lg:col-span-7">
                <SpecTable rows={selectedProperty.specTable} title={selectedProperty.title} />
              </div>
            </div>

            {/* SECTION B: Full-Width Video */}
            <div className="py-10 border-b border-neutral-200" data-sec="sec-video">
              <div className="relative w-full aspect-video bg-neutral-950 overflow-hidden group">
                <img src={selectedProperty.image} alt="Video Poster" className="absolute inset-0 w-full h-full object-cover opacity-40 blur-sm scale-105" />
                <div className="absolute inset-0 bg-neutral-950/40 group-hover:bg-neutral-950/20 transition-colors duration-300" />
                <button className="absolute inset-0 flex items-center justify-center z-10">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300">
                    <Play size={22} className="fill-black ml-1" />
                  </div>
                </button>
                <span className="absolute bottom-4 right-4 text-[9px] font-mono tracking-widest text-neutral-400 uppercase bg-neutral-900/80 px-2 py-1">DURATION: 03:45 // 4K SPEC</span>
              </div>
            </div>

            {/* SECTION C: Sticky Two-Column (Detailed Content + TOC + Form) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-14">

              {/* LEFT: Content (Overview → Payment Plan) */}
              <div className="lg:col-span-7 space-y-14 pb-8">

                {/* Overview */}
                <div data-sec="sec-overview">
                  <SH label="Overview" />
                  <p className="text-neutral-600 text-sm leading-relaxed mb-4">{selectedProperty.title} brings together a refined portfolio of premium properties crafted for the Port Harcourt elite residential and commercial sector.</p>
                  <h3 className="text-base font-semibold text-neutral-800 mb-2">A premium development built for modern life</h3>
                  <p className="text-neutral-600 text-sm leading-relaxed mb-4">{selectedProperty.overviewBullets[1]}</p>
                  <p className="text-neutral-600 text-sm leading-relaxed mb-4">{selectedProperty.overviewBullets[2]}</p>
                  <p className="text-[11px] text-neutral-500 mb-2">Key highlights include:</p>
                  <ul className="space-y-1.5 mb-5">
                    {selectedProperty.amenities.map((a: string, i: number) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-neutral-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 shrink-0" />{a}
                      </li>
                    ))}
                  </ul>
                  <h3 className="text-base font-semibold text-neutral-800 mb-2">A well-connected destination</h3>
                  <p className="text-neutral-600 text-sm leading-relaxed mb-3">{selectedProperty.overviewBullets[3]}</p>
                  <blockquote className="border-l-4 border-amber-400 pl-4 my-4 italic text-neutral-500 text-sm">"A well-designed home is a space that grows with your life — not just your lifestyle."</blockquote>
                </div>

                {/* Property Category */}
                <div data-sec="sec-propcat">
                  <SH label="Property category" />
                  <p className="text-neutral-600 text-sm leading-relaxed">{selectedProperty.propertyCategory}</p>
                </div>

                {/* Unit Types */}
                <div data-sec="sec-unittypes">
                  <SH label="Unit types and sizes" />
                  <p className="text-neutral-500 text-xs mb-4">Below is the detailed breakdown of each unit type within the community.</p>
                  <DataTable
                    headers={['Home Type', 'Beds', 'Size Range (Sq Ft)']}
                    rows={selectedProperty.unitTypes.map((u: any) => [u.type, u.beds, u.sizeRange])}
                  />
                </div>

                {/* Size Summary */}
                <div data-sec="sec-sizesum">
                  <SH label="At-a-glance size summary" />
                  <p className="text-neutral-500 text-xs mb-4">A quick comparison of the smallest and largest available homes.</p>
                  <DataTable
                    headers={['Category', 'Smallest Unit (Sq Ft)', 'Largest Unit (Sq Ft)']}
                    rows={selectedProperty.sizeSummary.map((s: any) => [s.category, s.smallest, s.largest])}
                  />
                </div>

                {/* Project Info */}
                <div data-sec="sec-projinfo">
                  <SH label="Project information" />
                  <p className="text-neutral-500 text-xs mb-4">Below is a structured overview of the development specification.</p>
                  <DataTable
                    headers={['Feature', 'Details']}
                    rows={selectedProperty.projectInfo.map((p: any) => [p.feature, p.details])}
                  />
                </div>

                {/* Project Features */}
                <div data-sec="sec-features">
                  <SH label="Project features and residential excellence" />
                  <p className="text-neutral-600 text-sm leading-relaxed mb-5">{selectedProperty.title} stands out for its thoughtful planning, spacious design, and cohesive architectural style.</p>
                  {[
                    { heading: 'Architectural strengths', key: 'architectural' },
                    { heading: 'Interiors built for comfort and style', key: 'interior' },
                    { heading: 'Community layout', key: 'community' },
                  ].map(({ heading, key }) => (
                    <div key={key} className="mb-5">
                      <h3 className="text-base font-semibold text-neutral-800 mb-2">{heading}</h3>
                      <ul className="space-y-1.5">
                        {selectedProperty.projectFeatures[key].map((item: string, i: number) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-neutral-600">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />{item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                {/* Location */}
                <div data-sec="sec-location">
                  <SH label="Location highlights" />
                  <p className="text-neutral-600 text-sm leading-relaxed mb-5">{selectedProperty.title} enjoys excellent connectivity and convenience.</p>
                  {[
                    { heading: 'Easy access to major destinations', sub: 'Nearby advantages:', key: 'connectivity' },
                    { heading: 'Lifestyle and leisure appeal',       sub: 'Nearby lifestyle spots:', key: 'lifestyle' },
                  ].map(({ heading, sub, key }) => (
                    <div key={key} className="mb-5">
                      <h3 className="text-base font-semibold text-neutral-800 mb-1">{heading}</h3>
                      <p className="text-[11px] text-neutral-500 mb-2">{sub}</p>
                      <ul className="space-y-1.5">
                        {selectedProperty.locationHighlights[key].map((item: string, i: number) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-neutral-600">
                            <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 mt-1.5 shrink-0" />{item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                {/* Facilities */}
                <div data-sec="sec-facilities">
                  <SH label="Facilities and amenities" />
                  <p className="text-neutral-600 text-sm leading-relaxed mb-4">The project includes a wide range of lifestyle, wellness, and community offerings.</p>
                  <DataTable
                    headers={['Facility Type', 'Details']}
                    rows={selectedProperty.facilitiesTable.map((f: any) => [f.type, f.details])}
                  />
                </div>

                {/* Benefits */}
                <div data-sec="sec-benefits">
                  <SH label="Benefits for buyers and investors" />
                  <p className="text-neutral-600 text-sm leading-relaxed mb-5">{selectedProperty.title} is ideal for both homebuyers and long-term investors.</p>
                  {[
                    { heading: 'Benefits for residents', key: 'residents' },
                    { heading: 'Benefits for investors', key: 'investors' },
                  ].map(({ heading, key }) => (
                    <div key={key} className="mb-5">
                      <h3 className="text-base font-semibold text-neutral-800 mb-2">{heading}</h3>
                      <ul className="space-y-1.5">
                        {selectedProperty.benefits[key].map((b: string, i: number) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-neutral-600">
                            <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 mt-1.5 shrink-0" />{b}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                {/* Payment Plan */}
                <div data-sec="sec-payment">
                  <SH label="Payment plan" />
                  <p className="text-neutral-600 text-sm leading-relaxed mb-4">A structured acquisition pathway designed to maximise accessibility without compromising asset security.</p>
                  <DataTable
                    headers={['Phase', 'Amount', 'Milestone']}
                    rows={selectedProperty.paymentPlan.map((p: any) => [
                      p.phase,
                      <span className="font-bold text-amber-600 text-base font-mono">{p.amount}</span>,
                      p.milestone,
                    ])}
                  />
                </div>
              </div>

              {/* RIGHT: Sticky TOC + Contact Form */}
              <div className="lg:col-span-5">
                <div className="sticky top-[48px] space-y-5">

                  {/* Content Table */}
                  <div className="bg-[#0D0D0D] border border-neutral-800 shadow-xl">
                    <button onClick={() => setTocOpen(v => !v)}
                      className="w-full flex items-center justify-between px-5 py-3.5 border-b border-neutral-800">
                      <span className="text-sm font-semibold text-white tracking-wide">Content Table</span>
                      {tocOpen ? <ChevronUp size={14} className="text-neutral-500" /> : <ChevronDown size={14} className="text-neutral-500" />}
                    </button>
                    {tocOpen && (
                      <div className="py-1 max-h-[175px] overflow-y-auto scrollbar-thin">
                        {TOC_ITEMS.map(item => (
                          <button key={item.id} onClick={() => scrollTo(item.id)}
                            className={`w-full text-left px-5 py-2 text-[11.5px] tracking-wide transition-all border-l-2 ${
                              activeSection === item.id
                                ? 'border-amber-500 text-amber-400 font-semibold bg-neutral-900'
                                : 'border-transparent text-neutral-400 hover:text-white hover:bg-neutral-900/50 font-normal'
                            }`}
                          >{item.label}</button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Contact Form */}
                  <div className="bg-[#0D0D0D] border border-neutral-800 p-6 shadow-xl">
                    <h3 className="text-xl font-light text-white tracking-tight mb-1">Interested in this property?</h3>
                    <p className="text-[11px] text-neutral-500 leading-relaxed mb-5">Fill in the form and we'll arrange a tour so you can explore this home for yourself.</p>
                    <form className="space-y-3" onSubmit={e => e.preventDefault()}>
                      <div className="grid grid-cols-2 gap-3">
                        {[{name:'name',label:'NAME',placeholder:'Jane Smith',type:'text'},{name:'phone',label:'PHONE',placeholder:'(123) 456-7890',type:'text'}].map(f => (
                          <div key={f.name}>
                            <label className="text-[9px] font-bold uppercase tracking-wider text-neutral-500 block mb-1">{f.label}</label>
                            <input type={f.type} name={f.name} value={(formData as any)[f.name]} onChange={handleInput} placeholder={f.placeholder}
                              className="w-full bg-[#141414] border border-neutral-800 text-white px-3 py-2.5 text-xs focus:outline-none focus:border-neutral-600 transition-colors placeholder-neutral-700" />
                          </div>
                        ))}
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[9px] font-bold uppercase tracking-wider text-neutral-500 block mb-1">EMAIL</label>
                          <input type="email" name="email" value={formData.email} onChange={handleInput} placeholder="jane@framer.com"
                            className="w-full bg-[#141414] border border-neutral-800 text-white px-3 py-2.5 text-xs focus:outline-none focus:border-neutral-600 transition-colors placeholder-neutral-700" />
                        </div>
                        <div>
                          <label className="text-[9px] font-bold uppercase tracking-wider text-neutral-500 block mb-1">PROPERTY TITLE</label>
                          <input type="text" value={selectedProperty.title} disabled
                            className="w-full bg-[#1A1A1A] border border-neutral-800 text-neutral-500 px-3 py-2.5 text-xs cursor-not-allowed" />
                        </div>
                      </div>
                      <div>
                        <label className="text-[9px] font-bold uppercase tracking-wider text-neutral-500 block mb-1">MESSAGE</label>
                        <textarea rows={4} name="message" value={formData.message} onChange={handleInput} placeholder="Write your message here"
                          className="w-full bg-[#141414] border border-neutral-800 text-white px-3 py-2.5 text-xs focus:outline-none focus:border-neutral-600 transition-colors resize-none placeholder-neutral-700" />
                      </div>
                      <button type="submit" className="w-full py-3 bg-white text-black hover:bg-neutral-200 transition-colors font-bold text-[10px] tracking-widest uppercase flex items-center justify-center gap-1.5">
                        ASK INFO <ChevronRight size={12} strokeWidth={3} />
                      </button>
                    </form>
                  </div>

                  {/* Amenities Icon Grid — below contact form */}
                  <div className="bg-[nautral] border border-neutral-800 shadow-xl overflow-hidden">
                    <div className="flex items-center justify-between px-5 py-3.5 border-b border-neutral-800">
                      <span className="text-xs font-semibold text-white tracking-wide">Amenities & Features</span>
                      <span className="text-[9px] font-mono text-neutral-500 tracking-widest uppercase">{selectedProperty.amenityIcons?.length ?? 0} Total</span>
                    </div>
                    {selectedProperty.amenityIcons && (
                      <AmenityGrid items={selectedProperty.amenityIcons} iconSize={24} />
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION D: Non-sticky — Construction Progress + Conclusion + Gallery + Map */}
            <div className="mt-14 space-y-14 pb-20">

              {/* Construction Progress */}
              <div data-sec="sec-construct">
                <SH label="Construction Progress Update" />
                <p className="text-neutral-600 text-sm leading-relaxed mb-4">The following table outlines the current construction milestone status across all major work categories.</p>
                <DataTable
                  headers={['Work Category', 'Current Status']}
                  rows={selectedProperty.constructionProgress.map((c: any) => [
                    c.work,
                    <span className={`text-[11px] font-medium ${c.status.toLowerCase().includes('complete') || c.status.toLowerCase().includes('live') ? 'text-green-600' : 'text-amber-600'}`}>{c.status}</span>,
                  ])}
                />
              </div>

              {/* Conclusion */}
              <div data-sec="sec-conclusion" className="border-t border-neutral-200 pt-10">
                <SH label="Conclusion" />
                <p className="text-neutral-600 text-sm leading-relaxed">{selectedProperty.conclusion}</p>
              </div>

              {/* Gallery */}
              <div data-sec="sec-gallery" className="border-t border-neutral-200 pt-10">
                <p className="text-[10px] font-black tracking-widest uppercase text-neutral-400 font-mono mb-4">// SITE CONDITION IMAGE FRAMEWORKS</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {selectedProperty.gallery.map((url: string, i: number) => (
                    <div key={i} className="aspect-video bg-neutral-950 overflow-hidden border border-neutral-200">
                      <img src={url} alt={`Gallery ${i+1}`} className="w-full h-full object-cover opacity-90 hover:opacity-100 hover:scale-105 transition-all duration-500 cursor-zoom-in" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Map */}
              <div data-sec="sec-map" className="border-t border-neutral-200 pt-10">
                <p className="text-[10px] font-black tracking-widest uppercase text-neutral-400 font-mono mb-4">// LAND REGISTRY COORDINATES MAP</p>
                <div className="bg-white border border-neutral-200 p-4 shadow-sm">
                  <div className="flex items-start gap-2 text-xs text-neutral-700 mb-3">
                    <Compass size={15} className="text-amber-500 mt-0.5 shrink-0" strokeWidth={1.5} />
                    <span><span className="font-bold text-neutral-900">VERIFIED ZONING: </span>
                    <span className="font-mono text-[11px] text-neutral-500">{selectedProperty.specTable.find((r: SpecRow) => r.icon === 'pin')?.value}</span></span>
                  </div>
                  <div className="w-full h-52 bg-neutral-100 border border-neutral-200 relative flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]" />
                    <div className="z-10 flex flex-col items-center gap-2 text-center">
                      <MapPin size={24} className="text-amber-500 animate-bounce" strokeWidth={1.5} />
                      <span className="text-[10px] font-mono tracking-widest font-bold text-neutral-500 uppercase">PORT HARCOURT ZONE MAP // ACCESS SECURE</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}