import { pool } from './db/pool.js';

const neighbourhoodsSeed = [
  {
    name: 'GRA Phase 2', city: 'Port Harcourt', state: 'Rivers State',
    score: 92, avg_rent: 3200000, avg_sale_price: 90000000,
    image_url: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600',
    trending: true,
    description: 'One of Port Harcourt\'s most prestigious addresses. Well-planned roads, excellent drainage, and proximity to major businesses.',
    security_score: 95, infrastructure_score: 90, transport_score: 85, amenities_score: 92, flooding_score: 88,
    drainage_score: 90, road_network_score: 85, power_score: 63, power_hours_per_day: '~15h/day',
    water_quality: 4, water_label: 'Excellent', water_source: 'Pipe + Borehole',
    water_note: 'Dedicated borehole with reliable pipe water backup across most streets.',
    flood_risk: false, c_of_o_common: true,
  },
  {
    name: 'Old GRA', city: 'Port Harcourt', state: 'Rivers State',
    score: 85, avg_rent: 2000000, avg_sale_price: 65000000,
    image_url: 'https://images.unsplash.com/photo-1449157291145-7efd050a4d0e?w=600',
    trending: false,
    description: 'A historic and calm neighbourhood favoured by government workers and professionals. Tree-lined streets and well-maintained properties.',
    security_score: 88, infrastructure_score: 82, transport_score: 80, amenities_score: 87, flooding_score: 84,
    drainage_score: 95, road_network_score: 80, power_score: 50, power_hours_per_day: '~12h/day',
    water_quality: 3, water_label: 'Good', water_source: 'Dedicated Borehole',
    water_note: 'Dedicated borehole supply; no consistent public pipe water.',
    flood_risk: false, c_of_o_common: true,
  },
  {
    name: 'Woji', city: 'Port Harcourt', state: 'Rivers State',
    score: 88, avg_rent: 2800000, avg_sale_price: 75000000,
    image_url: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=600',
    trending: true,
    description: 'A fast-growing upscale neighbourhood with excellent road connections to the East-West Road and Trans-Amadi industrial area.',
    security_score: 86, infrastructure_score: 89, transport_score: 90, amenities_score: 88, flooding_score: 82,
    drainage_score: 78, road_network_score: 90, power_score: 54, power_hours_per_day: '~13h/day',
    water_quality: 3, water_label: 'Good', water_source: 'Dedicated Borehole',
    water_note: 'Borehole with overhead tank; steady supply across most estates.',
    flood_risk: false, c_of_o_common: true,
  },
  {
    name: 'Victoria Island', city: 'Lagos', state: 'Lagos State',
    score: 97, avg_rent: 10000000, avg_sale_price: 350000000,
    image_url: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=600',
    trending: false,
    description: 'Lagos\'s most prestigious commercial and residential island. Home to multinationals, embassies, and Nigeria\'s elite.',
    security_score: 96, infrastructure_score: 98, transport_score: 92, amenities_score: 99, flooding_score: 88,
    drainage_score: 85, road_network_score: 92, power_score: 75, power_hours_per_day: '~18h/day',
    water_quality: 4, water_label: 'Excellent', water_source: 'Treated Mains + Borehole',
    water_note: 'Treated water mains with private borehole backup in most towers.',
    flood_risk: true, c_of_o_common: true,
  },
  {
    name: 'Lekki Phase 1', city: 'Lagos', state: 'Lagos State',
    score: 91, avg_rent: 7000000, avg_sale_price: 180000000,
    image_url: 'https://images.unsplash.com/photo-1496568816309-51d7c20e3b21?w=600',
    trending: true,
    description: 'A highly sought-after neighbourhood along the Lekki corridor. Mix of luxury estates and vibrant commercial activity.',
    security_score: 90, infrastructure_score: 92, transport_score: 85, amenities_score: 93, flooding_score: 82,
    drainage_score: 80, road_network_score: 85, power_score: 67, power_hours_per_day: '~16h/day',
    water_quality: 3, water_label: 'Good', water_source: 'Estate Borehole',
    water_note: 'Most estates run dedicated borehole systems with overhead storage.',
    flood_risk: true, c_of_o_common: true,
  },
  {
    name: 'Maitama', city: 'Abuja', state: 'FCT',
    score: 99, avg_rent: 15000000, avg_sale_price: 500000000,
    image_url: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600',
    trending: false,
    description: 'Abuja\'s most exclusive residential zone. Home to diplomats, ministers, and top executives. Impeccable infrastructure and security.',
    security_score: 99, infrastructure_score: 99, transport_score: 95, amenities_score: 99, flooding_score: 98,
    drainage_score: 98, road_network_score: 95, power_score: 92, power_hours_per_day: '~22h/day',
    water_quality: 4, water_label: 'Excellent', water_source: 'Treated Mains',
    water_note: 'Reliable FCDA-treated water mains supplemented by estate boreholes.',
    flood_risk: false, c_of_o_common: true,
  },
];

const agentsSeed = [
  { name: 'Chidinma Okafor', phone: '+2348012345678', photo_url: 'https://api.dicebear.com/7.x/personas/svg?seed=chidinma', agency: 'Apex Realty PHC', verified: true, rating: 4.9, deals_count: 47 },
  { name: 'Emeka Eze', phone: '+2348023456789', photo_url: 'https://api.dicebear.com/7.x/personas/svg?seed=emeka', agency: 'Prime Property Hub', verified: true, rating: 4.7, deals_count: 32 },
  { name: 'Fatima Abubakar', phone: '+2348034567890', photo_url: 'https://api.dicebear.com/7.x/personas/svg?seed=fatima', agency: 'TrustHome Abuja', verified: true, rating: 4.8, deals_count: 61 },
  { name: 'Seun Adeyemi', phone: '+2348045678901', photo_url: 'https://api.dicebear.com/7.x/personas/svg?seed=seun', agency: 'Lagos Nest Realty', verified: true, rating: 4.6, deals_count: 29 },
];

const propertiesSeed = [
  {
    title: 'Luxury 3-Bedroom Apartment, GRA Phase 2', address: '14 Woji Road, GRA Phase 2',
    neighbourhoodName: 'GRA Phase 2', agentIndex: 0,
    price: 3500000, listing_type: 'Rent', property_type: 'Apartment',
    bedrooms: 3, bathrooms: 3, toilets: 4, sqft: 1850,
    status: 'Available', verified: true, featured: true,
    description: 'A beautifully finished 3-bedroom apartment in the heart of GRA Phase 2. Features modern fittings, ample parking, and 24/7 security. Ideal for families and professionals.',
    move_in_rent: 3500000, move_in_agency_fee: 350000, move_in_legal_fee: 175000, move_in_caution_fee: 350000,
    latitude: 4.8156, longitude: 7.0498,
    images: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'],
    amenities: ['Generator', '24/7 Security', 'Swimming Pool', 'Parking', 'CCTV', 'Water Supply'],
  },
  {
    title: 'Modern 4-Bedroom Duplex, Woji', address: '7 Chevron Drive, Woji',
    neighbourhoodName: 'Woji', agentIndex: 1,
    price: 85000000, listing_type: 'Sale', property_type: 'Duplex',
    bedrooms: 4, bathrooms: 4, toilets: 5, sqft: 3200,
    status: 'Available', verified: true, featured: true,
    description: 'Stunning fully detached 4-bedroom duplex with BQ, set on a large plot in Woji. Excellent finishing throughout with imported tiles and fittings.',
    move_in_rent: 85000000, move_in_agency_fee: 2550000, move_in_legal_fee: 1275000, move_in_caution_fee: 0,
    latitude: 4.8412, longitude: 7.0231,
    images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800', 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800'],
    amenities: ['Generator', 'BQ', 'Garden', 'Parking x3', 'Water Borehole', 'CCTV'],
  },
  {
    title: 'Serviced 2-Bedroom Flat, Old GRA', address: '22 Azikiwe Road, Old GRA',
    neighbourhoodName: 'Old GRA', agentIndex: 0,
    price: 2200000, listing_type: 'Rent', property_type: 'Apartment',
    bedrooms: 2, bathrooms: 2, toilets: 2, sqft: 1100,
    status: 'Available', verified: true, featured: false,
    description: 'Well-maintained 2-bedroom flat in serene Old GRA. Perfect for a small family or working couple. All rooms en-suite.',
    move_in_rent: 2200000, move_in_agency_fee: 220000, move_in_legal_fee: 110000, move_in_caution_fee: 220000,
    latitude: 4.7880, longitude: 6.9987,
    images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'],
    amenities: ['Generator', 'Security', 'Parking', 'Water Supply', 'Tiled'],
  },
  {
    title: 'Executive Penthouse, Victoria Island', address: '1 Adeola Odeku Street, VI',
    neighbourhoodName: 'Victoria Island', agentIndex: 3,
    price: 12000000, listing_type: 'Rent', property_type: 'Penthouse',
    bedrooms: 4, bathrooms: 5, toilets: 5, sqft: 4500,
    status: 'Available', verified: true, featured: true,
    description: 'An ultra-luxury penthouse with panoramic ocean views. Features a private terrace, smart home automation, and world-class finishes. The pinnacle of Lagos living.',
    move_in_rent: 12000000, move_in_agency_fee: 1200000, move_in_legal_fee: 600000, move_in_caution_fee: 1200000,
    latitude: 6.4281, longitude: 3.4219,
    images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800', 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800'],
    amenities: ['Gym', 'Pool', 'Concierge', 'Generator', 'Elevator', 'Smart Home', 'Ocean View'],
  },
  {
    title: '3-Bedroom Terraced Duplex, Lekki Phase 1', address: '18 Freedom Way, Lekki Phase 1',
    neighbourhoodName: 'Lekki Phase 1', agentIndex: 3,
    price: 55000000, listing_type: 'Sale', property_type: 'Terraced',
    bedrooms: 3, bathrooms: 3, toilets: 4, sqft: 2100,
    status: 'Available', verified: true, featured: true,
    description: 'Contemporary terraced duplex in a well-secured estate in Lekki Phase 1. Modern kitchen, spacious living areas, and excellent neighbourhood.',
    move_in_rent: 55000000, move_in_agency_fee: 1650000, move_in_legal_fee: 825000, move_in_caution_fee: 0,
    latitude: 6.4474, longitude: 3.5217,
    images: ['https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=800', 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800'],
    amenities: ['Estate Security', 'Generator', 'Parking x2', 'Garden', 'Water Supply'],
  },
  {
    title: '5-Bedroom Detached Mansion, Maitama', address: '3 Aguiyi Ironsi Street, Maitama',
    neighbourhoodName: 'Maitama', agentIndex: 2,
    price: 250000000, listing_type: 'Sale', property_type: 'Duplex',
    bedrooms: 5, bathrooms: 6, toilets: 7, sqft: 6800,
    status: 'Available', verified: true, featured: false,
    description: 'An extraordinary 5-bedroom mansion in Abuja\'s most exclusive neighbourhood. Unmatched luxury finishes, expansive grounds, and exceptional security.',
    move_in_rent: 250000000, move_in_agency_fee: 7500000, move_in_legal_fee: 3750000, move_in_caution_fee: 0,
    latitude: 9.0846, longitude: 7.4994,
    images: ['https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800', 'https://images.unsplash.com/photo-1600047509782-20d39509f26d?w=800'],
    amenities: ['Swimming Pool', 'Gym', 'Cinema Room', 'Generator 100kva', 'BQ x2', 'Smart Home', 'Garden'],
  },
  {
    title: 'Cosy 1-Bedroom Self-Contain, Peter Odili Road', address: '45B Peter Odili Road',
    neighbourhoodName: 'GRA Phase 2', agentIndex: 0,
    price: 650000, listing_type: 'Rent', property_type: 'Self-Contain',
    bedrooms: 1, bathrooms: 1, toilets: 1, sqft: 480,
    status: 'Available', verified: true, featured: false,
    description: 'A clean and affordable self-contain apartment. Perfect for a working single professional. Well-ventilated rooms with tiled floors.',
    move_in_rent: 650000, move_in_agency_fee: 65000, move_in_legal_fee: 32500, move_in_caution_fee: 65000,
    latitude: 4.8021, longitude: 7.0133,
    images: ['https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800'],
    amenities: ['Security', 'Water Supply', 'Prepaid Meter'],
  },
  {
    title: '3-Bedroom Bungalow, Rumuola', address: '9 Bodo Street, Rumuola',
    neighbourhoodName: 'Woji', agentIndex: 1,
    price: 1800000, listing_type: 'Rent', property_type: 'Bungalow',
    bedrooms: 3, bathrooms: 2, toilets: 3, sqft: 1400,
    status: 'Available', verified: false, featured: false,
    description: 'Spacious 3-bedroom bungalow in a calm neighbourhood in Rumuola. Large compound with room for children to play. Close to major roads.',
    move_in_rent: 1800000, move_in_agency_fee: 180000, move_in_legal_fee: 90000, move_in_caution_fee: 180000,
    latitude: 4.8290, longitude: 7.0401,
    images: ['https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800'],
    amenities: ['Parking', 'Water Supply', 'Spacious Compound'],
  },
];

async function seed() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    console.log('Seeding neighbourhoods...');
    const neighbourhoodIdMap = new Map();
    for (const n of neighbourhoodsSeed) {
      const res = await client.query(
        `INSERT INTO neighbourhoods (
          name, city, state, score, avg_rent, avg_sale_price, image_url, trending, description,
          security_score, infrastructure_score, transport_score, amenities_score, flooding_score,
          drainage_score, road_network_score, power_score, power_hours_per_day,
          water_quality, water_label, water_source, water_note, flood_risk, c_of_o_common
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24)
        RETURNING id, name`,
        [
          n.name, n.city, n.state, n.score, n.avg_rent, n.avg_sale_price, n.image_url, n.trending, n.description,
          n.security_score, n.infrastructure_score, n.transport_score, n.amenities_score, n.flooding_score,
          n.drainage_score, n.road_network_score, n.power_score, n.power_hours_per_day,
          n.water_quality, n.water_label, n.water_source, n.water_note, n.flood_risk, n.c_of_o_common,
        ]
      );
      neighbourhoodIdMap.set(res.rows[0].name, res.rows[0].id);
    }
    console.log(`  → ${neighbourhoodIdMap.size} neighbourhoods inserted.`);

    console.log('Seeding agents...');
    const agentIds = [];
    for (const a of agentsSeed) {
      const res = await client.query(
        `INSERT INTO agents (name, phone, photo_url, agency, verified, rating, deals_count)
         VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id`,
        [a.name, a.phone, a.photo_url, a.agency, a.verified, a.rating, a.deals_count]
      );
      agentIds.push(res.rows[0].id);
    }
    console.log(`  → ${agentIds.length} agents inserted.`);

    console.log('Seeding properties...');
    let propCount = 0;
    for (const p of propertiesSeed) {
      const neighbourhoodId = neighbourhoodIdMap.get(p.neighbourhoodName) ?? null;
      const agentId = agentIds[p.agentIndex] ?? null;

      const res = await client.query(
        `INSERT INTO properties (
          title, address, neighbourhood_id, agent_id, price, listing_type, property_type,
          bedrooms, bathrooms, toilets, sqft, status, verified, featured, description,
          move_in_rent, move_in_agency_fee, move_in_legal_fee, move_in_caution_fee,
          latitude, longitude
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21)
        RETURNING id`,
        [
          p.title, p.address, neighbourhoodId, agentId, p.price, p.listing_type, p.property_type,
          p.bedrooms, p.bathrooms, p.toilets, p.sqft, p.status, p.verified, p.featured, p.description,
          p.move_in_rent, p.move_in_agency_fee, p.move_in_legal_fee, p.move_in_caution_fee,
          p.latitude, p.longitude,
        ]
      );
      const propertyId = res.rows[0].id;

      for (let i = 0; i < p.images.length; i++) {
        await client.query(
          `INSERT INTO property_images (property_id, url, sort_order) VALUES ($1, $2, $3)`,
          [propertyId, p.images[i], i]
        );
      }

      for (const label of p.amenities) {
        await client.query(
          `INSERT INTO property_amenities (property_id, label) VALUES ($1, $2)`,
          [propertyId, label]
        );
      }

      propCount++;
    }
    console.log(`  → ${propCount} properties inserted (with images + amenities).`);

    await client.query('COMMIT');
    console.log('✅ Seed completed successfully.');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Seed failed, rolled back:', err);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
