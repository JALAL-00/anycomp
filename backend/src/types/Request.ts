import { Request as ExpressRequest } from 'express';
import { UserRole } from '../models/User';

export interface CustomRequest extends ExpressRequest {
  user?: {
    id: string;
    role: UserRole;
  };
}
