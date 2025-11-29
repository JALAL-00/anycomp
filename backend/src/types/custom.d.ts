// src/types/custom.d.ts (FINAL FIX)

import { Request } from 'express';
import { UserRole } from '../models/User'; // Import the enum type

// Module Augmentation for Express Request object
declare module 'express' {
  interface Request {
    user?: {
      id: string;
      role: UserRole; // Use the imported UserRole enum
    };
  }
}