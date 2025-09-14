CREATE TABLE vibe_questions (
  id BIGSERIAL PRIMARY KEY,
  question TEXT NOT NULL,
  options TEXT[] NOT NULL, -- Array of answer options
  category VARCHAR(50) NOT NULL, -- personality, lifestyle, values, etc.
  weight DOUBLE PRECISION DEFAULT 1.0, -- Importance weight for matching
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default vibe questions
INSERT INTO vibe_questions (question, options, category, weight) VALUES
('Pineapple on pizza?', ARRAY['Love it!', 'Absolutely not', 'I''m Switzerland on this'], 'personality', 0.5),
('Your ideal Friday night?', ARRAY['Netflix and chill', 'Out with friends', 'Trying something new', 'Early bedtime'], 'lifestyle', 1.0),
('Communication style?', ARRAY['Text constantly', 'Call me maybe', 'Face to face', 'Memes speak louder'], 'personality', 1.5),
('Adventure level?', ARRAY['Skydiving? Yes!', 'Hiking sounds nice', 'Museums are fun', 'Home is adventure enough'], 'lifestyle', 1.2),
('Morning person or night owl?', ARRAY['Up with the sun', 'Night owl forever', 'Depends on coffee', 'What''s morning?'], 'lifestyle', 0.8);
