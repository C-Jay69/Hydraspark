
import { api } from '@encore.dev/encore';
import { auth } from '@encore.dev/auth';
import { db } from '../auth/db';

// Protect all endpoints in this file
api.middleware(async (req, next) => {
  const { userID } = auth.ctx();
  // Ensure the user is an admin
  const user = await db.queryOne`
    SELECT is_admin FROM users WHERE id = ${userID}
  `;
  if (!user || !user.is_admin) {
    throw new Error('Unauthorized: Admin access required');
  }
  return next(req);
});

interface User {
  id: string;
  email: string;
  name: string | null;
  is_admin: boolean;
  is_active: boolean;
  created_at: string;
}

interface ListUsersResponse {
  users: User[];
  count: number;
}

//encore:api public v1 path=/admin/users
export async function listUsers(query: { limit: number; offset: number }): Promise<ListUsersResponse> {
  const [users, countResult] = await Promise.all([
    db.query`
      SELECT id, email, name, is_admin, is_active, created_at
      FROM users
      ORDER BY created_at DESC
      LIMIT ${query.limit} OFFSET ${query.offset}
    `,
    db.queryOne`SELECT count(*) FROM users`
  ]);
  return { 
    users: users as User[],
    count: countResult.count,
  };
}


interface UpdateUserParams {
  userID: string;
  isAdmin?: boolean;
  isActive?: boolean;
}

//encore:api public v1 path=/admin/users/:userID method=PATCH
export async function updateUser(params: UpdateUserParams): Promise<{ success: boolean }> {
  const user = await db.queryOne`SELECT id FROM users WHERE id = ${params.userID}`;
  if (!user) {
    throw new Error('User not found');
  }

  // Dynamically build the update query
  const updates: any = {};
  if (params.isAdmin !== undefined) updates.is_admin = params.isAdmin;
  if (params.isActive !== undefined) updates.is_active = params.isActive;

  if (Object.keys(updates).length > 0) {
    await db.query`
      UPDATE users
      SET ${db.update(updates)}
      WHERE id = ${params.userID}
    `;
  }

  return { success: true };
}

//encore:api public v1 path=/admin/users/:userID method=DELETE
export async function deleteUser({ userID }: { userID: string }): Promise<{ success: boolean }> {
  await db.query`DELETE FROM users WHERE id = ${userID}`;
  return { success: true };
}
