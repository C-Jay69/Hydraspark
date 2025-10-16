
import { api } from "encore.dev/api";
import { authDB } from "../auth/db";

interface MakeAdminRequest {
  email: string;
}

// This is a temporary endpoint to grant admin privileges.
// It should be removed after the initial admin user is set up.
export const makeAdmin = api.v1<MakeAdminRequest, { status: string }>({
  expose: true,
  method: "POST",
  path: "/admin/make-admin",
  auth: false, // This is a temporary measure and should be secured or removed.
},
async ({ email }) => {
  const user = await authDB.queryOne`
    SELECT id FROM users WHERE email = ${email}
  `;

  if (!user) {
    return { status: "User not found" };
  }

  await authDB.exec`
    UPDATE users
    SET is_admin = TRUE, is_active = TRUE
    WHERE id = ${user.id}
  `;

  return { status: "Admin privileges granted" };
});
