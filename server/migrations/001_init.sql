CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE neighbourhoods (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name                  TEXT NOT NULL,
  city                  TEXT NOT NULL,
  state                 TEXT NOT NULL,
  score                 INTEGER NOT NULL DEFAULT 0,
  avg_rent              NUMERIC(14, 2) NOT NULL DEFAULT 0,
  avg_sale_price        NUMERIC(14, 2) NOT NULL DEFAULT 0,
  image_url             TEXT,
  trending              BOOLEAN NOT NULL DEFAULT FALSE,
  description           TEXT,
  security_score        INTEGER NOT NULL DEFAULT 0 CHECK (security_score BETWEEN 0 AND 100),
  infrastructure_score  INTEGER NOT NULL DEFAULT 0 CHECK (infrastructure_score BETWEEN 0 AND 100),
  transport_score       INTEGER NOT NULL DEFAULT 0 CHECK (transport_score BETWEEN 0 AND 100),
  amenities_score       INTEGER NOT NULL DEFAULT 0 CHECK (amenities_score BETWEEN 0 AND 100),
  flooding_score        INTEGER NOT NULL DEFAULT 0 CHECK (flooding_score BETWEEN 0 AND 100),
  drainage_score        INTEGER NOT NULL DEFAULT 0 CHECK (drainage_score BETWEEN 0 AND 100),
  road_network_score    INTEGER NOT NULL DEFAULT 0 CHECK (road_network_score BETWEEN 0 AND 100),
  power_score           INTEGER NOT NULL DEFAULT 0 CHECK (power_score BETWEEN 0 AND 100),
  power_hours_per_day   TEXT,
  water_quality          INTEGER NOT NULL DEFAULT 0 CHECK (water_quality BETWEEN 0 AND 4),
  water_label             TEXT,
  water_source             TEXT,
  water_note               TEXT,
  flood_risk             BOOLEAN NOT NULL DEFAULT FALSE,
  c_of_o_common           BOOLEAN NOT NULL DEFAULT FALSE,
  created_at             TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at             TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE agents (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,
  phone         TEXT NOT NULL,
  photo_url     TEXT,
  agency        TEXT,
  verified      BOOLEAN NOT NULL DEFAULT FALSE,
  rating        NUMERIC(2, 1) NOT NULL DEFAULT 0 CHECK (rating BETWEEN 0 AND 5),
  deals_count   INTEGER NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TYPE listing_type_enum AS ENUM ('Rent', 'Sale', 'Shortlet');
CREATE TYPE property_type_enum AS ENUM ('Apartment', 'Duplex', 'Bungalow', 'Terraced', 'Self-Contain', 'Penthouse');
CREATE TYPE property_status_enum AS ENUM ('Available', 'Taken', 'Pending');

CREATE TABLE properties (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title                 TEXT NOT NULL,
  address               TEXT NOT NULL,
  neighbourhood_id      UUID REFERENCES neighbourhoods(id) ON DELETE SET NULL,
  agent_id              UUID REFERENCES agents(id) ON DELETE SET NULL,
  price                 NUMERIC(14, 2) NOT NULL,
  listing_type          listing_type_enum NOT NULL,
  property_type         property_type_enum NOT NULL,
  bedrooms              INTEGER NOT NULL DEFAULT 0,
  bathrooms             INTEGER NOT NULL DEFAULT 0,
  toilets               INTEGER NOT NULL DEFAULT 0,
  sqft                  INTEGER NOT NULL DEFAULT 0,
  status                property_status_enum NOT NULL DEFAULT 'Available',
  verified              BOOLEAN NOT NULL DEFAULT FALSE,
  featured              BOOLEAN NOT NULL DEFAULT FALSE,
  description           TEXT,
  move_in_rent           NUMERIC(14, 2) DEFAULT 0,
  move_in_agency_fee     NUMERIC(14, 2) DEFAULT 0,
  move_in_legal_fee      NUMERIC(14, 2) DEFAULT 0,
  move_in_caution_fee    NUMERIC(14, 2) DEFAULT 0,
  latitude               NUMERIC(9, 6),
  longitude              NUMERIC(9, 6),
  posted_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at             TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at             TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_properties_neighbourhood ON properties(neighbourhood_id);
CREATE INDEX idx_properties_agent ON properties(agent_id);
CREATE INDEX idx_properties_listing_type ON properties(listing_type);

CREATE TABLE property_images (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id   UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  url           TEXT NOT NULL,
  sort_order    INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX idx_property_images_property ON property_images(property_id);

CREATE TABLE property_amenities (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id   UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  label         TEXT NOT NULL
);

CREATE INDEX idx_property_amenities_property ON property_amenities(property_id);

CREATE TYPE admin_role_enum AS ENUM ('owner', 'editor');

CREATE TABLE admin_users (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email           TEXT NOT NULL UNIQUE,
  password_hash   TEXT NOT NULL,
  role            admin_role_enum NOT NULL DEFAULT 'editor',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
