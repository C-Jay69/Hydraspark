import { api } from '@encore.dev/encore';
import { auth } from '@encore.dev/auth';
import { db } from '../auth/db';
// Protect all endpoints in this file
api.middleware(async (req, next) => {
    const { userID } = auth.ctx();
    const user = await db.queryOne `
    SELECT is_admin FROM users WHERE id = ${userID}
  `;
    if (!user || !user.is_admin) {
        throw new Error('Unauthorized');
    }
    return next(req);
});
export const listIcebreakers = api.v1({
    auth: true,
    path: '/admin/icebreakers',
    async handler() {
        const icebreakers = await db.query `SELECT * FROM icebreakers`;
        return { icebreakers };
    },
});
export const createIcebreaker = api.v1({
    auth: true,
    path: '/admin/icebreakers',
    method: 'POST',
    async handler(data) {
        const [icebreaker] = await db.query `
      INSERT INTO icebreakers (type, data)
      VALUES (${data.type}, ${data.data})
      RETURNING *
    `;
        return icebreaker;
    },
});
export const updateIcebreaker = api.v1({
    auth: true,
    path: '/admin/icebreakers/:id',
    method: 'PUT',
    async handler({ id, ...data }) {
        const [icebreaker] = await db.query `
      UPDATE icebreakers
      SET type = ${data.type}, data = ${data.data}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `;
        return icebreaker;
    },
});
export const deleteIcebreaker = api.v1({
    auth: true,
    path: '/admin/icebreakers/:id',
    method: 'DELETE',
    async handler({ id }) {
        await db.query `DELETE FROM icebreakers WHERE id = ${id}`;
        return { success: true };
    },
});
//# sourceMappingURL=icebreakers.js.map