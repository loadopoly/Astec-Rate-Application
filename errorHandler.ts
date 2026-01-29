/**
 * Global Error Handler Middleware
 */

import { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger';
import { config } from '../config/env';

// Custom API Error class
export class ApiError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(statusCode: number, message: string, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Common error factory methods
export const BadRequestError = (message = 'Bad Request') => 
  new ApiError(400, message);

export const UnauthorizedError = (message = 'Unauthorized') => 
  new ApiError(401, message);

export const ForbiddenError = (message = 'Forbidden') => 
  new ApiError(403, message);

export const NotFoundError = (message = 'Not Found') => 
  new ApiError(404, message);

export const ConflictError = (message = 'Conflict') => 
  new ApiError(409, message);

export const ValidationError = (message = 'Validation Error') => 
  new ApiError(422, message);

export const InternalError = (message = 'Internal Server Error') => 
  new ApiError(500, message, false);

// Error handler middleware
export const errorHandler = (
  err: Error | ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Log error
  logger.error({
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    ip: req.ip,
  });

  // Determine status code
  const statusCode = err instanceof ApiError ? err.statusCode : 500;
  
  // Build response
  const response: Record<string, unknown> = {
    error: err.name || 'Error',
    message: err.message || 'An unexpected error occurred',
  };

  // Include stack trace in development
  if (config.nodeEnv === 'development') {
    response.stack = err.stack;
  }

  // Send response
  res.status(statusCode).json(response);
};
