import { api, APIError } from "encore.dev/api";
import { authDB } from "./db";
// Gets the current user's profile.
export const getProfile = api({ expose: true, method: "GET", path: "/auth/profile/:userId" }, async ({ userId }) => {
    const user = await authDB.queryRow `
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
});
// Updates the current user's profile.
export const updateProfile = api({ expose: true, method: "PUT", path: "/auth/profile/:userId" }, async ({ userId, ...updates }) => {
    const updateFields = [];
    const values = [];
    let paramIndex = 1;
    if (updates.bio !== undefined) {
        updateFields.push(`bio = $${paramIndex++}`);
        values.push(updates.bio);
    }
    if (updates.interests !== undefined) {
        updateFields.push(`interests = $${paramIndex++}`);
        values.push(updates.interests);
    }
    if (updates.modes !== undefined) {
        updateFields.push(`modes = $${paramIndex++}`);
        values.push(updates.modes);
    }
    if (updates.city !== undefined) {
        updateFields.push(`city = $${paramIndex++}`);
        values.push(updates.city);
    }
    if (updates.locationLat !== undefined && updates.locationLng !== undefined) {
        updateFields.push(`location_lat = $${paramIndex++}`, `location_lng = $${paramIndex++}`);
        values.push(updates.locationLat, updates.locationLng);
    }
    if (updates.vibeAnswers !== undefined) {
        updateFields.push(`vibe_answers = $${paramIndex++}`);
        values.push(JSON.stringify(updates.vibeAnswers));
    }
    updateFields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(userId);
    if (updateFields.length === 1) { // Only timestamp update
        throw APIError.invalidArgument("No fields to update");
    }
    await authDB.rawExec(`UPDATE users SET ${updateFields.join(', ')} WHERE id = $${paramIndex}`, ...values);
    return getProfile({ userId });
});
// Gets all vibe questions for profile setup.
export const getVibeQuestions = api({ expose: true, method: "GET", path: "/auth/vibe-questions" }, async () => {
    const questions = await authDB.queryAll `
      SELECT id, question, options, category
      FROM vibe_questions
      WHERE is_active = true
      ORDER BY category, id
    `;
    return { questions };
});
//# sourceMappingURL=profile.js.map