// src/config/constants.ts

if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable is not set.");
}

export const JWT_SECRET = process.env.JWT_SECRET;
export const JWT_EXPIRY = '7d';
export const SALT_ROUNDS = 10; // For bcrypt hashing