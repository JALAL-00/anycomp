import { Response, NextFunction, Router } from 'express';
import { CustomRequest } from '../types/Request';
import * as jwt from 'jsonwebtoken';
import { ApiError } from './error.middleware';
import { JWT_SECRET } from '../config/constants';
import { UserRole } from '../models/User';

interface TokenPayload {
  id: string;
  role: UserRole;
  iat: number;
  exp: number;
}

export const protect = (req: CustomRequest, res: Response, next: NextFunction) => {
  let token: string | undefined;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new ApiError(401, 'Not authorized, no token provided.'));
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;

    req.user = {
      id: decoded.id,
      role: decoded.role
    };
    
    next();
  } catch (error) {
    console.error('JWT Verification Error:', error);
    return next(new ApiError(401, 'Not authorized, token failed or expired.'));
  }
};

export const authorize = (...roles: UserRole[]) => {
  return (req: CustomRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new ApiError(500, 'Authorization failed: User not attached to request.'));
    }
    
    if (!roles.includes(req.user.role)) {
      return next(new ApiError(403, `Forbidden: User role '${req.user.role}' is not allowed to access this resource.`));
    }
    
    next();
  };
};

export const protectedRoute = Router();
protectedRoute.get(
  '/admin-test',
  protect,
  authorize(UserRole.ADMIN),
  (req: CustomRequest, res: Response) => {
    res.status(200).json({
      status: 'success',
      message: `Welcome, Admin ${req.user!.id}`,
      user: req.user
    });
  }
);
