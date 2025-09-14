CREATE TABLE chat_messages (
  id BIGSERIAL PRIMARY KEY,
  match_id BIGINT NOT NULL,
  sender_id UUID NOT NULL,
  message_text TEXT NOT NULL,
  message_type VARCHAR(20) DEFAULT 'text', -- text, image, icebreaker
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE icebreakers (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(50) NOT NULL, -- two_truths_lie, would_you_rather, etc.
  prompts JSONB NOT NULL, -- Array of prompts/questions
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_chat_messages_match ON chat_messages(match_id);
CREATE INDEX idx_chat_messages_sender ON chat_messages(sender_id);
CREATE INDEX idx_icebreakers_category ON icebreakers(category);

-- Insert default icebreakers
INSERT INTO icebreakers (title, description, category, prompts) VALUES
('Two Truths and a Lie', 'Share three statements about yourself - two true, one false!', 'two_truths_lie', '[
  "Share three facts about yourself - but one is a lie! Can I guess which one?",
  "Time for two truths and a lie! Here are mine... now your turn!"
]'),
('Would You Rather', 'Choose between two fun scenarios', 'would_you_rather', '[
  "Would you rather have the ability to fly or be invisible?",
  "Would you rather always be 10 minutes late or 20 minutes early?",
  "Would you rather live in the mountains or by the ocean?"
]'),
('Quick Questions', 'Fun rapid-fire questions to break the ice', 'quick_questions', '[
  "Coffee or tea person?",
  "Morning person or night owl?",
  "Cats or dogs?",
  "Pizza or tacos?",
  "Beach vacation or mountain adventure?"
]');
