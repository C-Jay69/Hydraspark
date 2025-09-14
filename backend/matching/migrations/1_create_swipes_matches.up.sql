CREATE TABLE swipes (
  id BIGSERIAL PRIMARY KEY,
  swiper_id UUID NOT NULL,
  swiped_id UUID NOT NULL,
  direction VARCHAR(10) NOT NULL, -- 'left', 'right', 'super'
  vibe_score DOUBLE PRECISION,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(swiper_id, swiped_id)
);

CREATE TABLE matches (
  id BIGSERIAL PRIMARY KEY,
  user1_id UUID NOT NULL,
  user2_id UUID NOT NULL,
  vibe_score DOUBLE PRECISION NOT NULL,
  is_active BOOLEAN DEFAULT true,
  last_message_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user1_id, user2_id)
);

CREATE TABLE user_discovery_settings (
  user_id UUID PRIMARY KEY,
  min_age INTEGER DEFAULT 18,
  max_age INTEGER DEFAULT 100,
  max_distance INTEGER DEFAULT 50, -- in miles
  preferred_genders TEXT[],
  preferred_modes TEXT[], -- dating, friend
  show_verified_only BOOLEAN DEFAULT false,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_swipes_swiper ON swipes(swiper_id);
CREATE INDEX idx_swipes_swiped ON swipes(swiped_id);
CREATE INDEX idx_matches_users ON matches(user1_id, user2_id);
CREATE INDEX idx_matches_active ON matches(is_active) WHERE is_active = true;
