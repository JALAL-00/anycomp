// src/types/Request.ts (NEW FILE)

import { Request as ExpressRequest } from 'express';
import { UserRole } from '../models/User';

// Extend the Express Request type with the authenticated user data
export interface CustomRequest extends ExpressRequest {
  user?: {
    id: string;
    role: UserRole;
  };
}