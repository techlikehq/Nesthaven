BEGIN;

CREATE TYPE report_reason_enum AS ENUM (
  'asked_off_platform_contact',
  'asked_off_platform_payment',
  'suspicious_behavior',
  'other'
);

CREATE TABLE reports (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id   UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  reported_by       sender_type_enum NOT NULL,
  reason            report_reason_enum NOT NULL,
  details           TEXT,
  status            TEXT NOT NULL DEFAULT 'open',
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_reports_conversation ON reports(conversation_id);
CREATE INDEX idx_reports_status ON reports(status);

COMMIT;
