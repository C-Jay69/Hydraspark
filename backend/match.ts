
import { api } from "encore.dev/api";
import { auth } from "encore.dev/auth";
import { sql } from "encore.dev/storage/sql";

interface User {
    id: string;
    firstName: string;
    profilePicture: string;
}

interface GetMatchesResponse {
    matches: User[];
}

// GetMatches retrieves the list of users that the current user has matched with.
export const getMatches = api.GET("/matches", async (): Promise<GetMatchesResponse> => {
    const { id } = await auth.data();
    const matches = await sql<User>`
        SELECT u.id, u.first_name AS "firstName", u.profile_picture AS "profilePicture"
        FROM users u
        JOIN match m ON (m.user1_id = u.id AND m.user2_id = ${id}) OR (m.user2_id = u.id AND m.user1_id = ${id})
        WHERE u.id != ${id}
    `;
    return { matches };
});
