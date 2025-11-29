// src/middlewares/auth.middleware.ts

import { Response, NextFunction, Router } from 'express'; // Removed Request
import { CustomRequest } from '../types/Request'; // <-- NEW IMPORT
import * as jwt from 'jsonwebtoken';
import { ApiError } from './error.middleware';
import { JWT_SECRET } from '../config/constants';
import { UserRole } from '../models/User'; // Keep UserRole for type

// Define the structure of the JWT payload
interface TokenPayload {
  id: string;
  role: UserRole;
  iat: number;
  exp: number;
}

/**
 * Middleware to check for a valid JWT and attach user info to the request (req.user).
 */
export const protect = (req: CustomRequest, res: Response, next: NextFunction) => { // <-- Used CustomRequest
  let token: string | undefined;

  // 1. Check for token in 'Authorization: Bearer <token>' header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new ApiError(401, 'Not authorized, no token provided.'));
  }

  try {
    // 2. Verify the token
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;

    // 3. Attach user info to the request object
    req.user = {
      id: decoded.id,
      role: decoded.role,
    };
    
    next();
  } catch (error) {
    console.error('JWT Verification Error:', error);
    return next(new ApiError(401, 'Not authorized, token failed or expired.'));
  }
};

/**
 * Middleware to check if the authenticated user has one of the required roles (RBAC).
 * Example usage: authorize(UserRole.ADMIN, UserRole.SPECIALIST)
 */
export const authorize = (...roles: UserRole[]) => {
  return (req: CustomRequest, res: Response, next: NextFunction) => { // <-- Used CustomRequest
    // Check if the protect middleware ran successfully
    if (!req.user) {
        // This is a server configuration error, user should have been attached by 'protect'
        return next(new ApiError(500, 'Authorization failed: User not attached to request.'));
    }
    
    // Check if the user's role is included in the allowed roles list
    if (!roles.includes(req.user.role)) {
      return next(new ApiError(403, `Forbidden: User role '${req.user.role}' is not allowed to access this resource.`));
    }
    
    next();
  };
};

// Example Protected Route to test the middlewares
export const protectedRoute = Router();
protectedRoute.get(
    '/admin-test', 
    protect, 
    authorize(UserRole.ADMIN),
    (req: CustomRequest, res: Response) => { // <-- Used CustomRequest
        // The ! operator tells TS that req.user is definitely available here due to the 'protect' middleware
        res.status(200).json({ 
            status: 'success', 
            message: `Welcome, Admin ${req.user!.id}`,
            user: req.user
        });
    }
);