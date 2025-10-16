
import { SQL } from "encore.dev/storage/sql";
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

export async function GetRecommendations(): Promise<{ recommendations: Recommendation[] }> {
  const users = await SQL`
    SELECT id, "firstName", "lastName", bio, "profilePicture", interests, vibe FROM users
  `.then((res) => res.rows as User[]);

  // This is where you would implement your AI-powered matching algorithm.
  // For now, we'll just return a random set of users.
  const recommendations = users.sort(() => Math.random() - 0.5);

  return { recommendations };
}
