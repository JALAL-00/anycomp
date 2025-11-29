// src/middlewares/error.middleware.ts

import { Request, Response, NextFunction } from 'express';

/**
 * Custom error class for API errors with a specific status code.
 * Used for predictable API error responses (e.g., 404, 401, 400).
 */
export class ApiError extends Error {
  statusCode: number;
  isOperational: boolean; // Indicates errors we expect/can handle

  constructor(statusCode: number, message: string, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    // Set the prototype explicitly to ensure correct inheritance
    Object.setPrototypeOf(this, ApiError.prototype); 
  }
}

/**
 * Global Error Handling Middleware.
 * Catches all errors (including TypeORM/validation/custom errors) and sends a standardized JSON response.
 */
export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction 
) => {
  let statusCode = 500;
  let message = 'Internal Server Error';

  // 1. Handle Custom ApiError
  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
  } 
  // 2. Handle known database errors (e.g., TypeORM validation, unique constraint violations)
  else if (err.code === '23505') { // PostgreSQL unique violation code
    statusCode = 409; 
    message = 'Conflict: A record with this value already exists.';
  }
  // Add more specific error handling here (e.g., TypeORM `EntityNotFound` error)

  // Log non-operational errors (e.g., code bugs, third-party failures)
  if (statusCode === 500 && process.env.NODE_ENV !== 'test') {
    console.error(`Uncaught/Unhandled Error (${req.method} ${req.originalUrl}):`, err);
  }

  // Send the standardized JSON error response
  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message: message,
    // Include stack trace only in development
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};

/**
 * Middleware to handle unmatched routes (404 Not Found).
 * Must be placed after all other routes.
 */
export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  next(new ApiError(404, `Not Found: The requested URL ${req.originalUrl} was not found on this server.`));
};