
import { api } from "encore.dev/api";
import { authDB } from "../auth/db";
import { Swipe, Match } from "./db";
import { VibeQuestion } from "../auth/db";

interface User {
  id: number;
  firstName: string;
  lastName: string;
  bio: string;
  profilePicture: string;
  interests: string[];
  vibe: number;
}

interface Recommendation extends User {}

export const discover = api<{}, { recommendations: Recommendation[] }>(
    {
        method: "GET",
        path: "/matching/discover",
    },
    async () => {
        const users = await authDB.query<User>`
            SELECT id, "firstName", "lastName", bio, "profilePicture", interests, vibe FROM users
        `;

        const recommendations: Recommendation[] = [];
        for await (const user of users) {
            recommendations.push(user);
        }

        // This is where you would implement your AI-powered matching algorithm.
        // For now, we'll just return a random set of users.
        return { recommendations: recommendations.sort(() => Math.random() - 0.5) };
    }
);
