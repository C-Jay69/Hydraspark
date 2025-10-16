import { SQLDatabase } from "encore.dev/storage/sqldb";
export const authDB = new SQLDatabase("auth", {
    migrations: "./migrations",
});
//# sourceMappingURL=db.js.map