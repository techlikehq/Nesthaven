BEGIN;

CREATE TYPE conversation_status_enum AS ENUM ('active', 'closed', 'disputed');
CREATE TYPE sender_type_enum AS ENUM ('renter', 'agent');

CREATE TABLE conversations (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id     UUID REFERENCES properties(id) ON DELETE SET NULL,
  agent_id        UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  renter_name     TEXT NOT NULL,
  renter_phone    TEXT NOT NULL,
  renter_email    TEXT,
  status          conversation_status_enum NOT NULL DEFAULT 'active',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_conversations_agent ON conversations(agent_id);
CREATE INDEX idx_conversations_property ON conversations(property_id);
CREATE INDEX idx_conversations_renter_phone ON conversations(renter_phone);

CREATE TABLE messages (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id   UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_type       sender_type_enum NOT NULL,
  body              TEXT NOT NULL,
  read_at           TIMESTAMPTZ,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);

COMMIT;
