
import { api } from 'encore.dev/api';
import { auth } from 'encore.dev/auth';
import { authDB } from '../auth/db';

interface Icebreaker {
  id: string;
  type: string;
  data: any;
}

const checkAdmin = async () => {
  const { userID } = auth.ctx();
  const user = await authDB.queryOne`
    SELECT is_admin FROM users WHERE id = ${userID}
  `;
  if (!user || !user.is_admin) {
    throw new Error('Unauthorized');
  }
};

export const listIcebreakers = api.v1({
  auth: true,
  path: '/admin/icebreakers',
  async handler(): Promise<{ icebreakers: Icebreaker[] }> {
    await checkAdmin();
    const icebreakers = await authDB.query`SELECT * FROM icebreakers`;
    return { icebreakers };
  },
});

export const createIcebreaker = api.v1({
  auth: true,
  path: '/admin/icebreakers',
  method: 'POST',
  async handler(data: { type: string, data: any }): Promise<Icebreaker> {
    await checkAdmin();
    const [icebreaker] = await authDB.query`
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
  async handler({ id, ...data }: { id: string, type: string, data: any }): Promise<Icebreaker> {
    await checkAdmin();
    const [icebreaker] = await authDB.query`
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
  async handler({ id }: { id: string }): Promise<{ success: boolean }> {
    await checkAdmin();
    await authDB.query`DELETE FROM icebreakers WHERE id = ${id}`;
    return { success: true };
  },
});
