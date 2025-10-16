import { api, APIError } from "encore.dev/api";
import { authDB } from "./db";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "your-super-secret-key");
// Handles user login.
export const login = api({
    expose: true,
    method: "POST",
    path: "/auth/login",
    cors: ["*"] // Allow requests from any origin
}, async ({ email, password }) => {
    const user = await authDB.queryOne `
      SELECT id, password, is_active FROM users WHERE email = ${email}
    `;
    if (!user) {
        throw APIError.unauthenticated("Invalid email or password");
    }
    if (!user.is_active) {
        throw APIError.permissionDenied("This account has been deactivated.");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw APIError.unauthenticated("Invalid email or password");
    }
    // Create a JWT token
    const token = await new SignJWT({ userID: user.id })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("24h")
        .sign(JWT_SECRET);
    return { token };
});
//# sourceMappingURL=login.js.map