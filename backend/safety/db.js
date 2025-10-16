import { SQLDatabase } from "encore.dev/storage/sqldb";
export const safetyDB = new SQLDatabase("safety", {
    migrations: "./migrations",
});
//# sourceMappingURL=db.js.map