import { User, UserRole } from '../models/User';
import { AppDataSource } from '../db/data-source';
import { ApiError } from '../middlewares/error.middleware';
import * as jwt from 'jsonwebtoken';
import { JWT_SECRET, JWT_EXPIRY } from '../config/constants';

const userRepository = AppDataSource.getRepository(User);

export const generateToken = (userId: string, role: UserRole): string => {
  return jwt.sign({ id: userId, role: role }, JWT_SECRET, {
    expiresIn: JWT_EXPIRY,
  });
};

export const registerUser = async (email: string, password: string): Promise<{ user: User, token: string }> => {
  const existingUser = await userRepository.findOneBy({ email });
  if (existingUser) {
    throw new ApiError(409, 'User with this email already exists.');
  }

  const newUser = userRepository.create({ email, password, role: UserRole.ADMIN }); 
  await userRepository.save(newUser);
  
  const token = generateToken(newUser.id, newUser.role);

  return { user: newUser, token };
};

export const loginUser = async (email: string, password: string): Promise<{ user: User, token: string }> => {
  const user = await userRepository.findOneBy({ email });
  if (!user || !user.is_active) {
    throw new ApiError(401, 'Invalid credentials or user is inactive.');
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new ApiError(401, 'Invalid credentials.');
  }

  const token = generateToken(user.id, user.role);

  return { user, token };
};

export const createAdminIfNotExist = async () => {
    const adminEmail = 'admin@stcomp.com';
    const existingAdmin = await userRepository.findOneBy({ email: adminEmail, role: UserRole.ADMIN });

    if (!existingAdmin) {
        const adminUser = userRepository.create({
            email: adminEmail,
            password: 'AdminPassword123', 
            role: UserRole.ADMIN,
        });
        await userRepository.save(adminUser);
        console.log(`\n🔑 Initial Admin User Created: ${adminEmail} (Password: AdminPassword123)\n`);
    }
}