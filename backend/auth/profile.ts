
import { api, APIError } from "encore.dev/api";
import { authDB } from "./db";

export interface UpdateProfileRequest {
  bio?: string;
  interests?: string[];
  modes?: string[];
  city?: string;
  locationLat?: number;
  locationLng?: number;
  vibeAnswers?: Record<string, string>;
}

export interface ProfileResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  bio?: string;
  profilePhotos: string[];
  videoStoryUrl?: string;
  interests: string[];
  modes: string[];
  city?: string;
  isVerified: boolean;
  safetyScore: number;
  premiumTier: string;
  vibeAnswers?: Record<string, string>;
}

// Gets the current user's profile.
export const getProfile = api.v1.get("/auth/profile/:userId",
  async ({ userId } : { userId: string }): Promise<ProfileResponse> => {
    const user = await authDB.queryRow<{
      id: string;
      email: string;
      first_name: string;
      last_name: string;
      bio: string;
      profile_photos: string[];
      video_story_url: string;
      interests: string[];
      modes: string[];
      city: string;
      is_verified: boolean;
      safety_score: number;
      premium_tier: string;
      vibe_answers: Record<string, string>;
    }>`
      SELECT id, email, first_name, last_name, bio, profile_photos, video_story_url,
             interests, modes, city, is_verified, safety_score, premium_tier, vibe_answers
      FROM users 
      WHERE id = ${userId} AND is_active = true
    `;

    if (!user) {
      throw APIError.notFound("User not found");
    }

    return {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      bio: user.bio,
      profilePhotos: user.profile_photos || [],
      videoStoryUrl: user.video_story_url,
      interests: user.interests || [],
      modes: user.modes || [],
      city: user.city,
      isVerified: user.is_verified,
      safetyScore: user.safety_score,
      premiumTier: user.premium_tier,
      vibeAnswers: user.vibe_answers,
    };
  }
);

// Updates the current user's profile.
export const updateProfile = api.v1.put<UpdateProfileRequest & { userId: string }, ProfileResponse>("/auth/profile/:userId",
  async ({ userId, ...updates }) => {
    const updateFields: string[] = [];
    const values: any[] = [];

    if (updates.bio !== undefined) {
      updateFields.push(`bio = $${values.length + 1}`);
      values.push(updates.bio);
    }
    if (updates.interests !== undefined) {
      updateFields.push(`interests = $${values.length + 1}`);
      values.push(updates.interests);
    }
    if (updates.modes !== undefined) {
      updateFields.push(`modes = $${values.length + 1}`);
      values.push(updates.modes);
    }
    if (updates.city !== undefined) {
      updateFields.push(`city = $${values.length + 1}`);
      values.push(updates.city);
    }
    if (updates.locationLat !== undefined && updates.locationLng !== undefined) {
      updateFields.push(`location_lat = $${values.length + 1}`, `location_lng = $${values.length + 2}`);
      values.push(updates.locationLat, updates.locationLng);
    }
    if (updates.vibeAnswers !== undefined) {
      updateFields.push(`vibe_answers = $${values.length + 1}`);
      values.push(JSON.stringify(updates.vibeAnswers));
    }

    if (updateFields.length === 0) { 
      throw APIError.invalidArgument("No fields to update");
    }
    
    updateFields.push(`updated_at = CURRENT_TIMESTAMP`);

    await authDB.query(
      `UPDATE users SET ${updateFields.join(', ')} WHERE id = $${values.length + 1}`,
      ...values, userId
    );

    return getProfile({ userId });
  }
);

// Gets all vibe questions for profile setup.
export const getVibeQuestions = api.v1.get("/auth/vibe-questions",
  async (): Promise<{ questions: Array<{
    id: number;
    question: string;
    options: string[];
    category: string;
  }> }> => {
    const questions = await authDB.query<{
      id: number;
      question: string;
      options: string[];
      category: string;
    }>`
      SELECT id, question, options, category
      FROM vibe_questions
      WHERE is_active = true
      ORDER BY category, id
    `;

    return { questions };
  }
);
