import { SQLDatabase } from "encore.dev/storage/sqldb";

export const matchingDB = new SQLDatabase("matching", {
  migrations: "./migrations",
});
