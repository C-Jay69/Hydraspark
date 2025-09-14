import { api, APIError } from "encore.dev/api";
import { matchingDB } from "./db";
import { authDB } from "../auth/db";

export interface DiscoverRequest {
  userId: string;
  limit?: number;
}

export interface DiscoverResponse {
  profiles: Array<{
    id: string;
    firstName: string;
    lastName: string;
    age: number;
    bio?: string;
    profilePhotos: string[];
    videoStoryUrl?: string;
    distance?: number;
    vibeScore: number;
    interests: string[];
    isVerified: boolean;
  }>;
  hasMore: boolean;
}

// Discovers potential matches for a user based on their preferences.
export const discover = api<DiscoverRequest, DiscoverResponse>(
  { expose: true, method: "GET", path: "/matching/discover/:userId" },
  async ({ userId, limit = 10 }) => {
    // Get user's current location and preferences
    const user = await authDB.queryRow<{
      location_lat: number;
      location_lng: number;
      date_of_birth: Date;
      vibe_answers: Record<string, string>;
      modes: string[];
      daily_swipes_used: number;
      premium_tier: string;
      last_swipe_reset: Date;
    }>`
      SELECT location_lat, location_lng, date_of_birth, vibe_answers, modes,
             daily_swipes_used, premium_tier, last_swipe_reset
      FROM users 
      WHERE id = ${userId}
    `;

    if (!user) {
      throw APIError.notFound("User not found");
    }

    // Check if daily swipes need reset
    const today = new Date().toISOString().split('T')[0];
    const lastReset = user.last_swipe_reset?.toISOString().split('T')[0];
    
    if (lastReset !== today) {
      await authDB.exec`
        UPDATE users 
        SET daily_swipes_used = 0, last_swipe_reset = CURRENT_DATE
        WHERE id = ${userId}
      `;
      user.daily_swipes_used = 0;
    }

    // Check swipe limits for free users
    if (user.premium_tier === 'free' && user.daily_swipes_used >= 50) {
      return { profiles: [], hasMore: false };
    }

    // Get discovery settings
    const settings = await matchingDB.queryRow<{
      min_age: number;
      max_age: number;
      max_distance: number;
      preferred_genders: string[];
      preferred_modes: string[];
      show_verified_only: boolean;
    }>`
      SELECT min_age, max_age, max_distance, preferred_genders, preferred_modes, show_verified_only
      FROM user_discovery_settings
      WHERE user_id = ${userId}
    ` || {
      min_age: 18,
      max_age: 100,
      max_distance: 50,
      preferred_genders: [],
      preferred_modes: user.modes,
      show_verified_only: false
    };

    // Find potential matches
    const profiles = await authDB.queryAll<{
      id: string;
      first_name: string;
      last_name: string;
      date_of_birth: Date;
      bio: string;
      profile_photos: string[];
      video_story_url: string;
      location_lat: number;
      location_lng: number;
      vibe_answers: Record<string, string>;
      interests: string[];
      is_verified: boolean;
    }>`
      SELECT u.id, u.first_name, u.last_name, u.date_of_birth, u.bio,
             u.profile_photos, u.video_story_url, u.location_lat, u.location_lng,
             u.vibe_answers, u.interests, u.is_verified
      FROM users u
      WHERE u.id != ${userId}
        AND u.is_active = true
        AND NOT EXISTS (
          SELECT 1 FROM swipes s 
          WHERE s.swiper_id = ${userId} AND s.swiped_id = u.id
        )
        AND (EXTRACT(YEAR FROM AGE(u.date_of_birth)) BETWEEN ${settings.min_age} AND ${settings.max_age})
        ${settings.show_verified_only ? 'AND u.is_verified = true' : ''}
      ORDER BY RANDOM()
      LIMIT ${limit}
    `;

    const discoveryProfiles = profiles.map(profile => {
      const age = new Date().getFullYear() - new Date(profile.date_of_birth).getFullYear();
      
      // Calculate distance if both users have location
      let distance: number | undefined;
      if (user.location_lat && user.location_lng && profile.location_lat && profile.location_lng) {
        distance = calculateDistance(
          user.location_lat, user.location_lng,
          profile.location_lat, profile.location_lng
        );
      }

      // Calculate vibe score
      const vibeScore = calculateVibeScore(user.vibe_answers || {}, profile.vibe_answers || {});

      return {
        id: profile.id,
        firstName: profile.first_name,
        lastName: profile.last_name,
        age,
        bio: profile.bio,
        profilePhotos: profile.profile_photos || [],
        videoStoryUrl: profile.video_story_url,
        distance,
        vibeScore,
        interests: profile.interests || [],
        isVerified: profile.is_verified,
      };
    });

    // Filter by distance and sort by vibe score
    const filteredProfiles = discoveryProfiles
      .filter(p => !p.distance || p.distance <= settings.max_distance)
      .sort((a, b) => b.vibeScore - a.vibeScore);

    return {
      profiles: filteredProfiles,
      hasMore: filteredProfiles.length === limit,
    };
  }
);

function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 3959; // Earth's radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function calculateVibeScore(answers1: Record<string, string>, answers2: Record<string, string>): number {
  const commonQuestions = Object.keys(answers1).filter(q => answers2[q]);
  if (commonQuestions.length === 0) return 0.5;

  let totalScore = 0;
  let weightSum = 0;

  commonQuestions.forEach(questionId => {
    const weight = 1.0; // Could be fetched from vibe_questions table
    const match = answers1[questionId] === answers2[questionId] ? 1 : 0;
    totalScore += match * weight;
    weightSum += weight;
  });

  return Math.round((totalScore / weightSum) * 100) / 100;
}
