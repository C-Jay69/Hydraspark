import { api, APIError } from "encore.dev/api";
import { authDB } from "./db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { secret } from "encore.dev/config";

const jwtSecret = secret("JWTSecret");

function getJWTSecret(): string {
  try {
    return jwtSecret();
  } catch (error) {
    console.warn("JWTSecret not configured, using fallback. This should only happen in development.");
    return process.env.JWT_SECRET || "development-secret-change-in-production-12345";
  }
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    isVerified: boolean;
    premiumTier: string;
  };
}

// Authenticates a user and returns a JWT token.
export const login = api<LoginRequest, LoginResponse>(
  { expose: true, method: "POST", path: "/auth/login" },
  async (req) => {
    // Find user by email
    const user = await authDB.queryRow<{
      id: string;
      email: string;
      password_hash: string;
      first_name: string;
      last_name: string;
      is_verified: boolean;
      premium_tier: string;
      is_active: boolean;
    }>`
      SELECT id, email, password_hash, first_name, last_name, is_verified, premium_tier, is_active
      FROM users 
      WHERE email = ${req.email}
    `;

    if (!user) {
      throw APIError.unauthenticated("Invalid email or password");
    }

    if (!user.is_active) {
      throw APIError.permissionDenied("Account has been deactivated");
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(req.password, user.password_hash);
    if (!isValidPassword) {
      throw APIError.unauthenticated("Invalid email or password");
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        premiumTier: user.premium_tier
      },
      getJWTSecret(),
      { expiresIn: "7d" }
    );

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        isVerified: user.is_verified,
        premiumTier: user.premium_tier,
      },
    };
  }
);
