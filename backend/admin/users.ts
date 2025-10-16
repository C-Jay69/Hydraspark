
import { api } from 'encore.dev/api';
import { auth } from 'encore.dev/auth';
import { authDB } from '../auth/db';

const checkAdmin = async () => {
  const { userID } = auth.ctx();
  const user = await authDB.queryOne`
    SELECT is_admin FROM users WHERE id = ${userID}
  `;
  if (!user || !user.is_admin) {
    throw new Error('Unauthorized: Admin access required');
  }
};

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

export const listUsers = api.v1.get('/admin/users', {
  auth: true,
  async handler(query: { limit: number; offset: number }): Promise<ListUsersResponse> {
    await checkAdmin();
    const [users, countResult] = await Promise.all([
      authDB.query`
        SELECT id, email, name, is_admin, is_active, created_at
        FROM users
        ORDER BY created_at DESC
        LIMIT ${query.limit} OFFSET ${query.offset}
      `,
      authDB.queryOne`SELECT count(*) FROM users`
    ]);
    return { 
      users: users as User[],
      count: countResult.count,
    };
  }
});


interface UpdateUserParams {
  userID: string;
  isAdmin?: boolean;
  isActive?: boolean;
}

export const updateUser = api.v1.patch('/admin/users/:userID', {
  auth: true,
  async handler(params: UpdateUserParams): Promise<{ success: boolean }> {
    await checkAdmin();
    const user = await authDB.queryOne`SELECT id FROM users WHERE id = ${params.userID}`;
    if (!user) {
      throw new Error('User not found');
    }

    const updates: string[] = [];
    const queryParams: any[] = [];

    if (params.isAdmin !== undefined) {
        updates.push('is_admin = $1');
        queryParams.push(params.isAdmin);
    }

    if (params.isActive !== undefined) {
        updates.push('is_active = $2');
        queryParams.push(params.isActive);
    }

  if (Object.keys(updates).length > 0) {
      await authDB.query(
          `UPDATE users SET ${updates.join(', ')} WHERE id = $3`,
          ...queryParams, params.userID
      );
  }

    return { success: true };
  }
});

export const deleteUser = api.v1.delete('/admin/users/:userID', {
  auth: true,
  async handler({ userID }: { userID: string }): Promise<{ success: boolean }> {
    await checkAdmin();
    await authDB.query`DELETE FROM users WHERE id = ${userID}`;
    return { success: true };
  }
});
