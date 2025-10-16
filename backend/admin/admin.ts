
import { api } from '@encore.dev/encore';
import { auth } from '@encore.dev/auth';
import { db } from '../auth/db';

interface UserStats {
  totalUsers: number;
}

export const getUserStats = api.v1({
  auth: true,
  path: '/admin/user-stats',
  async handler() {
    const { userID } = auth.ctx();

    const user = await db.queryOne`
      SELECT is_admin FROM users WHERE id = ${userID}
    `;

    if (!user || !user.is_admin) {
      throw new Error('Unauthorized');
    }

    const result = await db.queryOne`
      SELECT count(*) as "totalUsers" FROM users
    `;

    return {
      totalUsers: result.totalUsers,
    };
  },
});
