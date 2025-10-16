import { SQL } from "encore.dev/storage/sql";
export async function GetRecommendations() {
    const users = await SQL `
    SELECT id, "firstName", "lastName", bio, "profilePicture", interests, vibe FROM users
  `.then((res) => res.rows);
    // This is where you would implement your AI-powered matching algorithm.
    // For now, we'll just return a random set of users.
    const recommendations = users.sort(() => Math.random() - 0.5);
    return { recommendations };
}
//# sourceMappingURL=discover.js.map