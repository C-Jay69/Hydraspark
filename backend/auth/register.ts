
import { api, APIError } from "encore.dev/api";
import { authDB } from "./db";
import bcrypt from "bcryptjs";
import { indexUser } from "../search";
import { getProfile } from "./profile";

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender?: string;
  phone?: string;
}

export interface RegisterResponse {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
}

// Registers a new user account.
export const register = api<RegisterRequest, RegisterResponse>(
  {
    expose: true,
    method: "POST",
    path: "/auth/register",
  },
  async (req: RegisterRequest) => {
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
    const existingUser = await authDB.queryRow`
      SELECT id FROM users WHERE email = ${req.email}
    `;
    if (existingUser) {
      throw APIError.alreadyExists("A user with this email already exists");
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(req.password, 10);

    // Insert new user into the database
    const user = await authDB.queryRow`
      INSERT INTO users (email, password_hash, first_name, last_name, date_of_birth, gender, phone)
      VALUES (${req.email}, ${hashedPassword}, ${req.firstName}, ${req.lastName}, ${req.dateOfBirth}, ${req.gender}, ${req.phone})
      RETURNING id, email, first_name, last_name
    `;

    if (!user) {
      throw APIError.internal("Failed to create user");
    }

    // Index the new user in Typesense
    const userProfile = await getProfile({ userId: user.id });
    await indexUser(userProfile);

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
      },
    };
  }
);
