
import { authDB } from "./auth/db";

async function grantAdmin() {
  const email = "user@example.com";
  const user = await authDB.queryOne`
    SELECT id FROM users WHERE email = ${email}
  `;

  if (!user) {
    console.log("User not found");
    return;
  }

  await authDB.exec`
    UPDATE users
    SET is_admin = TRUE, is_active = TRUE
    WHERE id = ${user.id}
  `;

  console.log("Admin privileges granted");
}

grantAdmin();
