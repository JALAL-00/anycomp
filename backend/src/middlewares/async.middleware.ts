import { Request, Response, NextFunction } from 'express';
import { CustomRequest } from '../types/Request';

type AsyncHandler = (req: CustomRequest, res: Response, next: NextFunction) => Promise<any>;

const asyncHandler = (fn: AsyncHandler) => 
  (req: CustomRequest, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

export default asyncHandler;