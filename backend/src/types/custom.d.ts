import { Request } from 'express';
import { UserRole } from '../models/User';

declare module 'express' {
  interface Request {
    user?: {
      id: string;
      role: UserRole;
    };
  }
}
