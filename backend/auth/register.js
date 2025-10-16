import { api, APIError } from "encore.dev/api";
import { authDB } from "./db";
import bcrypt from "bcryptjs";
// Registers a new user account.
export const register = api({
    expose: true,
    method: "POST",
    path: "/auth/register",
    cors: ["*"]
}, async (req) => {
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(req.email)) {
        throw APIError.invalidArgument("Invalid email format");
    }
    // Validate password strength
    if (req.password.length < 8) {
        throw APIError.invalidArgument("Password must be at least 8 characters");
    }
    // Check if user already exists
    const existingUser = await authDB.queryOne `
      SELECT id FROM users WHERE email = ${req.email}
    `;
    if (existingUser) {
        throw APIError.alreadyExists("A user with this email already exists");
    }
    // Hash the password
    const hashedPassword = await bcrypt.hash(req.password, 10);
    // Insert new user into the database
    const { rows } = await authDB.query `
      INSERT INTO users (email, password, first_name, last_name, date_of_birth, gender, phone_number)
      VALUES (${req.email}, ${hashedPassword}, ${req.firstName}, ${req.lastName}, ${req.dateOfBirth}, ${req.gender}, ${req.phone})
      RETURNING id, email, first_name, last_name
    `;
    const user = rows[0];
    return {
        user: {
            id: user.id,
            email: user.email,
            firstName: user.first_name,
            lastName: user.last_name,
        },
    };
});
//# sourceMappingURL=register.js.map