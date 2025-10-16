import { api, APIError } from "encore.dev/api";
import { matchingDB } from "./db";
import { authDB } from "../auth/db";
// Records a swipe action and checks for matches.
export const swipe = api({ expose: true, method: "POST", path: "/matching/swipe" }, async ({ userId, targetUserId, direction }) => {
    // Check daily swipe limit for free users
    const user = await authDB.queryRow `
      SELECT daily_swipes_used, premium_tier, last_swipe_reset
      FROM users 
      WHERE id = ${userId}
    `;
    if (!user) {
        throw APIError.notFound("User not found");
    }
    // Check if daily swipes need reset
    const today = new Date().toISOString().split('T')[0];
    const lastReset = user.last_swipe_reset?.toISOString().split('T')[0];
    let dailySwipesUsed = user.daily_swipes_used;
    if (lastReset !== today) {
        await authDB.exec `
        UPDATE users 
        SET daily_swipes_used = 0, last_swipe_reset = CURRENT_DATE
        WHERE id = ${userId}
      `;
        dailySwipesUsed = 0;
    }
    // Check swipe limits for free users (50 per day)
    if (user.premium_tier === 'free' && dailySwipesUsed >= 50) {
        throw APIError.resourceExhausted("Daily swipe limit reached. Upgrade to premium for unlimited swipes.");
    }
    // Get both users' vibe answers for scoring
    const users = await authDB.queryAll `
      SELECT id, vibe_answers
      FROM users 
      WHERE id IN (${userId}, ${targetUserId})
    `;
    const currentUser = users.find(u => u.id === userId);
    const targetUser = users.find(u => u.id === targetUserId);
    if (!currentUser || !targetUser) {
        throw APIError.notFound("User not found");
    }
    // Calculate vibe score
    const vibeScore = calculateVibeScore(currentUser.vibe_answers || {}, targetUser.vibe_answers || {});
    // Record the swipe
    await matchingDB.exec `
      INSERT INTO swipes (swiper_id, swiped_id, direction, vibe_score)
      VALUES (${userId}, ${targetUserId}, ${direction}, ${vibeScore})
      ON CONFLICT (swiper_id, swiped_id) DO UPDATE SET
        direction = EXCLUDED.direction,
        vibe_score = EXCLUDED.vibe_score,
        created_at = CURRENT_TIMESTAMP
    `;
    // Update daily swipes count
    await authDB.exec `
      UPDATE users 
      SET daily_swipes_used = daily_swipes_used + 1
      WHERE id = ${userId}
    `;
    // Check for mutual right swipes (match)
    let isMatch = false;
    let matchId;
    if (direction === "right" || direction === "super") {
        const mutualSwipe = await matchingDB.queryRow `
        SELECT direction
        FROM swipes
        WHERE swiper_id = ${targetUserId} AND swiped_id = ${userId}
      `;
        if (mutualSwipe && (mutualSwipe.direction === "right" || mutualSwipe.direction === "super")) {
            isMatch = true;
            // Create match record (ensure user1_id < user2_id for consistency)
            const [user1Id, user2Id] = userId < targetUserId ? [userId, targetUserId] : [targetUserId, userId];
            const match = await matchingDB.queryRow `
          INSERT INTO matches (user1_id, user2_id, vibe_score)
          VALUES (${user1Id}, ${user2Id}, ${vibeScore})
          ON CONFLICT (user1_id, user2_id) DO UPDATE SET
            vibe_score = EXCLUDED.vibe_score,
            is_active = true
          RETURNING id
        `;
            matchId = match?.id;
        }
    }
    return {
        isMatch,
        vibeScore: direction === "right" || direction === "super" ? vibeScore : undefined,
        matchId,
    };
});
function calculateVibeScore(answers1, answers2) {
    const commonQuestions = Object.keys(answers1).filter(q => answers2[q]);
    if (commonQuestions.length === 0)
        return 0.5;
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
// Gets user's matches.
export const getMatches = api({ expose: true, method: "GET", path: "/matching/matches/:userId" }, async ({ userId }) => {
    const matches = await matchingDB.queryAll `
      SELECT id, user1_id, user2_id, vibe_score, last_message_at, created_at
      FROM matches
      WHERE (user1_id = ${userId} OR user2_id = ${userId})
        AND is_active = true
      ORDER BY created_at DESC
    `;
    const matchesWithUsers = await Promise.all(matches.map(async (match) => {
        const otherUserId = match.user1_id === userId ? match.user2_id : match.user1_id;
        const user = await authDB.queryRow `
          SELECT id, first_name, last_name, profile_photos, is_verified
          FROM users
          WHERE id = ${otherUserId}
        `;
        return {
            id: match.id,
            user: {
                id: user.id,
                firstName: user.first_name,
                lastName: user.last_name,
                profilePhotos: user.profile_photos || [],
                isVerified: user.is_verified,
            },
            vibeScore: match.vibe_score,
            lastMessageAt: match.last_message_at,
            createdAt: match.created_at,
        };
    }));
    return { matches: matchesWithUsers };
});
//# sourceMappingURL=swipe.js.map