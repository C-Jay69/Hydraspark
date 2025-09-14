import { api, APIError } from "encore.dev/api";
import { authDB } from "./db";
import bcrypt from "bcryptjs";

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
  { expose: true, method: "POST", path: "/auth/register" },
  async (req) => {
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(req.email)) {
      throw APIError.invalidArgument("Invalid email format");
    }

    // Validate password strength
    if (req.password.length < 8) {
      throw APIError.invalidArgument("Password must be at least 8 characters");
    }

    // Validate age (must be 18+)
    const birthDate = new Date(req.dateOfBirth);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    if (age < 18) {
      throw APIError.invalidArgument("Must be 18 or older to register");
    }

    // Check if user already exists
    const existingUser = await authDB.queryRow`
      SELECT id FROM users WHERE email = ${req.email}
    `;
    if (existingUser) {
      throw APIError.alreadyExists("User with this email already exists");
    }

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(req.password, saltRounds);

    // Create user
    const user = await authDB.queryRow<{
      id: string;
      email: string;
      first_name: string;
      last_name: string;
    }>`
      INSERT INTO users (email, password_hash, first_name, last_name, date_of_birth, gender, phone)
      VALUES (${req.email}, ${passwordHash}, ${req.firstName}, ${req.lastName}, ${req.dateOfBirth}, ${req.gender}, ${req.phone})
      RETURNING id, email, first_name, last_name
    `;

    if (!user) {
      throw APIError.internal("Failed to create user");
    }

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
