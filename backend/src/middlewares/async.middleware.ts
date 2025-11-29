// src/middlewares/async.middleware.ts

import { Request, Response, NextFunction } from 'express';
import { CustomRequest } from '../types/Request';

// Type definition for an Express middleware/route handler function
type AsyncHandler = (req: CustomRequest, res: Response, next: NextFunction) => Promise<any>;

const asyncHandler = (fn: AsyncHandler) => 
  (req: CustomRequest, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

export default asyncHandler;