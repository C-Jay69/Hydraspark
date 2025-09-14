CREATE TABLE trusted_contacts (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL,
  contact_name VARCHAR(100) NOT NULL,
  contact_phone VARCHAR(20) NOT NULL,
  contact_email VARCHAR(255),
  relationship VARCHAR(50), -- friend, family, partner, etc.
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE check_ins (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL,
  location_name VARCHAR(255) NOT NULL,
  location_lat DOUBLE PRECISION NOT NULL,
  location_lng DOUBLE PRECISION NOT NULL,
  planned_end_time TIMESTAMP NOT NULL,
  actual_end_time TIMESTAMP,
  status VARCHAR(20) DEFAULT 'active', -- active, completed, overdue, emergency
  notes TEXT,
  companion_info TEXT, -- Who they're meeting
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE panic_alerts (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL,
  location_lat DOUBLE PRECISION,
  location_lng DOUBLE PRECISION,
  alert_type VARCHAR(20) DEFAULT 'panic', -- panic, check_in_overdue
  status VARCHAR(20) DEFAULT 'active', -- active, resolved, false_alarm
  notes TEXT,
  notified_contacts TEXT[], -- Array of contact IDs that were notified
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  resolved_at TIMESTAMP
);

CREATE TABLE safety_actions (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL,
  action_type VARCHAR(50) NOT NULL, -- verification, check_in, trusted_contact_add, etc.
  points_earned INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_trusted_contacts_user ON trusted_contacts(user_id);
CREATE INDEX idx_check_ins_user ON check_ins(user_id);
CREATE INDEX idx_check_ins_status ON check_ins(status);
CREATE INDEX idx_panic_alerts_user ON panic_alerts(user_id);
CREATE INDEX idx_panic_alerts_status ON panic_alerts(status);
CREATE INDEX idx_safety_actions_user ON safety_actions(user_id);
