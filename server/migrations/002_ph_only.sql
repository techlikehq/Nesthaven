BEGIN;

INSERT INTO neighbourhoods (
  name, city, state, score, avg_rent, avg_sale_price, image_url, trending, description,
  security_score, infrastructure_score, transport_score, amenities_score, flooding_score,
  drainage_score, road_network_score, power_score, power_hours_per_day,
  water_quality, water_label, water_source, water_note, flood_risk, c_of_o_common
) VALUES
(
  'Trans-Amadi', 'Port Harcourt', 'Rivers State', 80, 2600000, 60000000,
  'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=600', false,
  'Major industrial and commercial corridor with a growing mix of residential developments. Strong road access to the rest of the city.',
  82, 85, 88, 80, 75,
  75, 88, 58, '~14h/day',
  3, 'Good', 'Borehole + Tanker Supply', 'Most residences rely on private boreholes; tanker delivery common for backup.',
  false, true
),
(
  'D-Line', 'Port Harcourt', 'Rivers State', 86, 2900000, 70000000,
  'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=600', true,
  'Central, busy commercial and residential mix close to the heart of the city. High accessibility to banks, markets, and offices.',
  84, 87, 90, 90, 80,
  82, 88, 60, '~14h/day',
  3, 'Good', 'Dedicated Borehole', 'Borehole supply standard across most buildings; reliable but not municipal.',
  false, true
),
(
  'Rumuokoro', 'Port Harcourt', 'Rivers State', 74, 1600000, 38000000,
  'https://images.unsplash.com/photo-1449157291145-7efd050a4d0e?w=600', true,
  'Major transport junction connecting multiple parts of the city. Mixed-income area popular for affordability and accessibility.',
  72, 70, 85, 78, 65,
  60, 82, 46, '~11h/day',
  2, 'Fair', 'Borehole + Public Tap', 'Mix of private boreholes and shared public water points; supply varies by street.',
  true, false
),
(
  'Eliozu', 'Port Harcourt', 'Rivers State', 81, 2300000, 55000000,
  'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600', true,
  'Fast-growing residential area popular with young professionals. New estates and improving road infrastructure.',
  80, 78, 75, 82, 78,
  72, 76, 54, '~13h/day',
  3, 'Good', 'Estate Borehole', 'Newer estates typically include dedicated borehole and overhead tank systems.',
  false, true
),
(
  'Eagle Island', 'Port Harcourt', 'Rivers State', 79, 2400000, 58000000,
  'https://images.unsplash.com/photo-1496568816309-51d7c20e3b21?w=600', false,
  'Waterside residential area with a distinct, quieter character. Mix of older and newer residential developments.',
  78, 74, 70, 75, 60,
  58, 72, 50, '~12h/day',
  2, 'Fair', 'Borehole + Tanker Supply', 'Borehole supply common; some streets depend on tanker delivery during dry season.',
  true, true
),
(
  'Mile 3 / Diobu', 'Port Harcourt', 'Rivers State', 68, 1200000, 28000000,
  'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=600', false,
  'Dense, highly affordable area popular with lower-to-mid income renters. Close to major markets and motor parks.',
  65, 62, 80, 85, 55,
  50, 75, 42, '~10h/day',
  2, 'Fair', 'Public Tap + Borehole', 'Mix of public water points and private boreholes; supply can be inconsistent.',
  true, false
);

UPDATE properties
SET neighbourhood_id = (SELECT id FROM neighbourhoods WHERE name = 'D-Line')
WHERE title = 'Executive Penthouse, Victoria Island';

UPDATE properties
SET neighbourhood_id = (SELECT id FROM neighbourhoods WHERE name = 'Trans-Amadi')
WHERE title = '3-Bedroom Terraced Duplex, Lekki Phase 1';

UPDATE properties
SET neighbourhood_id = (SELECT id FROM neighbourhoods WHERE name = 'D-Line')
WHERE title = '5-Bedroom Detached Mansion, Maitama';

DELETE FROM neighbourhoods WHERE name IN ('Victoria Island', 'Lekki Phase 1', 'Maitama');

COMMIT;
