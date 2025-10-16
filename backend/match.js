import { api } from "encore.dev/api";
import { auth } from "encore.dev/auth";
import { sql } from "encore.dev/storage/sql";
// GetMatches retrieves the list of users that the current user has matched with.
export const getMatches = api.GET("/matches", async () => {
    const { id } = await auth.data();
    const matches = await sql `
        SELECT u.id, u.first_name AS "firstName", u.profile_picture AS "profilePicture"
        FROM users u
        JOIN match m ON (m.user1_id = u.id AND m.user2_id = ${id}) OR (m.user2_id = u.id AND m.user1_id = ${id})
        WHERE u.id != ${id}
    `;
    return { matches };
});
//# sourceMappingURL=match.js.map