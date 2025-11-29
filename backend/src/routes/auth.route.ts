// src/routes/auth.route.ts

import { Router, Response } from 'express'; // Removed Request
import { CustomRequest } from '../types/Request'; // <-- NEW IMPORT
import { registerUser, loginUser } from '../services/auth.service';
import { ApiError } from '../middlewares/error.middleware';
import { validate } from 'class-validator';
import { User } from '../models/User';

const authRouter = Router();

/**
 * @route POST /api/auth/register
 * @description Registers a new specialist user.
 * @access Public
 */
authRouter.post('/register', async (req: CustomRequest, res: Response) => { // <-- Used CustomRequest
  const { email, password } = req.body;

  // Simple input validation check
  if (!email || !password) {
    throw new ApiError(400, 'Email and password are required.');
  }

  // Optional: More rigorous validation using User model (class-validator)
  const userToValidate = new User();
  userToValidate.email = email;
  userToValidate.password = password;
  const errors = await validate(userToValidate, { skipMissingProperties: true });
  if (errors.length > 0) {
      throw new ApiError(400, errors.map(err => Object.values(err.constraints || {})).flat().join(', '));
  }


  const { user, token } = await registerUser(email, password);

  // Return the user (excluding password) and the JWT token
  res.status(201).json({
    status: 'success',
    token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      is_active: user.is_active,
    },
  });
});

/**
 * @route POST /api/auth/login
 * @description Authenticates a user and returns a JWT token.
 * @access Public
 */
authRouter.post('/login', async (req: CustomRequest, res: Response) => { // <-- Used CustomRequest
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
      is_active: user.is_active,
    },
  });
});

export default authRouter;