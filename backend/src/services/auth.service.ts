// src/services/auth.service.ts

import { User, UserRole } from '../models/User';
import { AppDataSource } from '../db/data-source';
import { ApiError } from '../middlewares/error.middleware';
import * as jwt from 'jsonwebtoken';
import { JWT_SECRET, JWT_EXPIRY } from '../config/constants';

const userRepository = AppDataSource.getRepository(User);

/**
 * Creates and returns a JWT token for a given user ID and role.
 */
export const generateToken = (userId: string, role: UserRole): string => {
  return jwt.sign({ id: userId, role: role }, JWT_SECRET, {
    expiresIn: JWT_EXPIRY,
  });
};

/**
 * Handles user registration (Sign Up).
 */
export const registerUser = async (email: string, password: string): Promise<{ user: User, token: string }> => {
  // 1. Check if user already exists
  const existingUser = await userRepository.findOneBy({ email });
  if (existingUser) {
    throw new ApiError(409, 'User with this email already exists.');
  }

  // 2. Create and save new user (password hashing is handled by the @BeforeInsert hook in User.ts)
  const newUser = userRepository.create({ email, password, role: UserRole.SPECIALIST });
  await userRepository.save(newUser);
  
  // 3. Generate token
  const token = generateToken(newUser.id, newUser.role);

  return { user: newUser, token };
};

/**
 * Handles user login.
 */
export const loginUser = async (email: string, password: string): Promise<{ user: User, token: string }> => {
  // 1. Find user by email
  const user = await userRepository.findOneBy({ email });
  if (!user || !user.is_active) {
    throw new ApiError(401, 'Invalid credentials or user is inactive.');
  }

  // 2. Compare passwords
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new ApiError(401, 'Invalid credentials.');
  }

  // 3. Generate token
  const token = generateToken(user.id, user.role);

  return { user, token };
};

/**
 * Optional: Creates a mandatory Admin user if none exists (for seeding/initial setup).
 */
export const createAdminIfNotExist = async () => {
    const adminEmail = 'admin@stcomp.com';
    const existingAdmin = await userRepository.findOneBy({ email: adminEmail, role: UserRole.ADMIN });

    if (!existingAdmin) {
        // Note: Password must meet MinLength validation (default 8 chars)
        const adminUser = userRepository.create({
            email: adminEmail,
            password: 'AdminPassword123', // Hardcoded initial password
            role: UserRole.ADMIN,
        });
        await userRepository.save(adminUser);
        console.log(`\n🔑 Initial Admin User Created: ${adminEmail} (Password: AdminPassword123)\n`);
    }
}