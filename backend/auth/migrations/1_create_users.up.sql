CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20) UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  date_of_birth DATE NOT NULL,
  gender VARCHAR(20),
  bio TEXT,
  profile_photos TEXT[], -- Array of photo URLs
  video_story_url TEXT,
  location_lat DOUBLE PRECISION,
  location_lng DOUBLE PRECISION,
  city VARCHAR(100),
  vibe_answers JSONB, -- Store vibe question answers
  interests TEXT[], -- Array of interests
  modes TEXT[] DEFAULT ARRAY['dating'], -- dating, friend, both
  is_verified BOOLEAN DEFAULT false,
  verification_photo_url TEXT,
  safety_score INTEGER DEFAULT 0,
  premium_tier VARCHAR(20) DEFAULT 'free', -- free, premium
  premium_expires_at TIMESTAMP,
  daily_swipes_used INTEGER DEFAULT 0,
  last_swipe_reset DATE DEFAULT CURRENT_DATE,
  spotlight_swipes INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_location ON users(location_lat, location_lng);
CREATE INDEX idx_users_modes ON users USING GIN(modes);
CREATE INDEX idx_users_active ON users(is_active) WHERE is_active = true;
