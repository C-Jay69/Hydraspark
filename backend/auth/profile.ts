
import { api, APIError } from "encore.dev/api";
import { authDB } from "./db";
import { indexUser } from "../search";

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

// Defines the request shape for getProfile.
interface GetProfileParams {
    userId: string;
}

// Gets the current user's profile.
export const getProfile = api<GetProfileParams, ProfileResponse>(
  {
    method: "GET",
    path: "/auth/profile/:userId",
  },
  async ({ userId }): Promise<ProfileResponse> => {
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
export const updateProfile = api<UpdateProfileRequest & { userId: string }, ProfileResponse>(
    {
        method: "PUT",
        path: "/auth/profile/:userId",
    },
    async ({ userId, ...updates }) => {
        const currentUser = await authDB.queryRow`
            SELECT bio, interests, modes, city, location_lat, location_lng, vibe_answers
            FROM users
            WHERE id = ${userId}
        `;

        if (!currentUser) {
            throw APIError.notFound("User not found");
        }

        const vibeAnswersUpdate = updates.vibeAnswers ? JSON.stringify(updates.vibeAnswers) : currentUser.vibe_answers;

        await authDB.query`
            UPDATE users
            SET 
                bio = ${updates.bio !== undefined ? updates.bio : currentUser.bio},
                interests = ${updates.interests !== undefined ? updates.interests : currentUser.interests},
                modes = ${updates.modes !== undefined ? updates.modes : currentUser.modes},
                city = ${updates.city !== undefined ? updates.city : currentUser.city},
                location_lat = ${updates.locationLat !== undefined ? updates.locationLat : currentUser.location_lat},
                location_lng = ${updates.locationLng !== undefined ? updates.locationLng : currentUser.location_lng},
                vibe_answers = ${vibeAnswersUpdate},
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ${userId}
        `;

        const updatedProfile = await getProfile({ userId });
        // Index the updated user profile in Typesense
        await indexUser(updatedProfile);
        return updatedProfile;
    }
);

interface VibeQuestion {
    id: number;
    question: string;
    options: string[];
    category: string;
}

// Gets all vibe questions for profile setup.
export const getVibeQuestions = api<{}, { questions: VibeQuestion[] }>( 
    {
        method: "GET",
        path: "/auth/vibe-questions",
    },
    async () => {
        const questionRows = authDB.query<VibeQuestion>`
            SELECT id, question, options, category
            FROM vibe_questions
            WHERE is_active = true
            ORDER BY category, id
        `;

        const questions: VibeQuestion[] = [];
        for await (const row of questionRows) {
            questions.push(row);
        }

        return { questions };
    }
);
