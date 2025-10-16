
CREATE TABLE icebreakers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type VARCHAR(50) NOT NULL,
  data JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_icebreakers_type ON icebreakers(type);

-- Pre-populate with existing data
INSERT INTO icebreakers (type, data) VALUES
('two_truths_one_lie', '{
  "statements": [
    {"text": "I have traveled to more than 5 countries", "isLie": false},
    {"text": "I can speak 3 languages fluently", "isLie": true},
    {"text": "I have a pet dog named Max", "isLie": false}
  ]
}'),
('two_truths_one_lie', '{
  "statements": [
    {"text": "I once won a hot dog eating contest.", "isLie": false},
    {"text": "I write poetry in my spare time.", "isLie": false},
    {"text": "I have never seen the movie Titanic.", "isLie": true}
  ]
}');
