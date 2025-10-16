
import { api } from "encore.dev/api";
import { auth } from "encore.dev/auth";
import { SQLDatabase } from "encore.dev/storage/sqldb";

// Define the database schema for groups
const GroupDB = new SQLDatabase("group", {
    migrations: "./migrations",
});

export interface Group {
    id: number;
    name: string;
    description: string;
    createdBy: string;
}

export interface GroupMember {
    groupId: number;
    userId: string;
}

interface ListGroupsResponse {
    groups: Group[];
}

// listGroups lists all available groups.
export const listGroups = api.GET("/groups", async (): Promise<ListGroupsResponse> => {
    const groups = await GroupDB.query<Group>`
        SELECT id, name, description, created_by AS "createdBy" FROM "group"
    `;
    return { groups };
});

interface CreateGroupRequest {
    name: string;
    description: string;
}

// createGroup creates a new group.
export const createGroup = api.POST("/groups", async (req: CreateGroupRequest): Promise<Group> => {
    const { id } = await auth.data();
    const group = await GroupDB.queryOne<Group>`
        INSERT INTO "group" (name, description, created_by)
        VALUES (${req.name}, ${req.description}, ${id})
        RETURNING id, name, description, created_by AS "createdBy"
    `;
    return group;
});

interface JoinGroupRequest {
    groupId: number;
}

// joinGroup allows a user to join a group.
export const joinGroup = api.POST("/groups/:groupId/join", { auth: true }, async ({ groupId }: JoinGroupRequest): Promise<void> => {
    const { id } = await auth.data();
    await GroupDB.exec`
        INSERT INTO group_member (group_id, user_id)
        VALUES (${groupId}, ${id})
        ON CONFLICT (group_id, user_id) DO NOTHING
    `;
});
