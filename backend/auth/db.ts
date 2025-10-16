import { SQLDatabase } from "encore.dev/storage/sqldb";

export interface VibeQuestion {
    id: number;
    question: string;
    options: string[];
    category: string;
    weight: number;
    is_active: boolean;
    created_at: string;
}

export const authDB = new SQLDatabase("auth", {
  migrations: "./migrations",
});
