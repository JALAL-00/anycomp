import { Router, Response } from 'express';
import { CustomRequest } from '../types/Request';
import { registerUser, loginUser } from '../services/auth.service';
import { ApiError } from '../middlewares/error.middleware';
import { validate } from 'class-validator';
import { User } from '../models/User';
import asyncHandler from '../middlewares/async.middleware';

const authRouter = Router();

authRouter.post('/register', asyncHandler(async (req: CustomRequest, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, 'Email and password are required.');
  }

  const userToValidate = new User();
  userToValidate.email = email;
  userToValidate.password = password;
  const errors = await validate(userToValidate, { skipMissingProperties: true });
  if (errors.length > 0) {
    throw new ApiError(400, errors.map(err => Object.values(err.constraints || {})).flat().join(', '));
  }

  const { user, token } = await registerUser(email, password);

  res.status(201).json({
    status: 'success',
    token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      is_active: user.is_active
    }
  });
}));

authRouter.post('/login', asyncHandler(async (req: CustomRequest, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, 'Email and password are required.');
  }

  const { user, token } = await loginUser(email, password);

  res.status(200).json({
    status: 'success',
    token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      is_active: user.is_active
    }
  });
}));

export default authRouter;
