import { SQLDatabase } from "encore.dev/storage/sqldb";

export interface Swipe {
  id: number;
  swiper_id: string;
  swiped_id: string;
  direction: "left" | "right" | "super";
  vibe_score?: number;
  created_at: string;
}

export interface Match {
  id: number;
  user1_id: string;
  user2_id: string;
  vibe_score: number;
  is_active: boolean;
  last_message_at?: string;
  created_at: string;
}

export const matchingDB = new SQLDatabase("matching", {
  migrations: "./migrations",
});
