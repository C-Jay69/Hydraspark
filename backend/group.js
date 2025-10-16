import { api } from "encore.dev/api";
import { auth } from "encore.dev/auth";
import { SQLDatabase } from "encore.dev/storage/sqldb";
// Define the database schema for groups
const GroupDB = new SQLDatabase("group", {
    migrations: "./migrations",
});
// listGroups lists all available groups.
export const listGroups = api.GET("/groups", async () => {
    const groups = await GroupDB.query `
        SELECT id, name, description, created_by AS "createdBy" FROM "group"
    `;
    return { groups };
});
// createGroup creates a new group.
export const createGroup = api.POST("/groups", async (req) => {
    const { id } = await auth.data();
    const group = await GroupDB.queryOne `
        INSERT INTO "group" (name, description, created_by)
        VALUES (${req.name}, ${req.description}, ${id})
        RETURNING id, name, description, created_by AS "createdBy"
    `;
    return group;
});
// joinGroup allows a user to join a group.
export const joinGroup = api.POST("/groups/:groupId/join", { auth: true }, async ({ groupId }) => {
    const { id } = await auth.data();
    await GroupDB.exec `
        INSERT INTO group_member (group_id, user_id)
        VALUES (${groupId}, ${id})
        ON CONFLICT (group_id, user_id) DO NOTHING
    `;
});
//# sourceMappingURL=group.js.map