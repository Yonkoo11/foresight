import { Request, Response, NextFunction } from 'express';

/**
 * Custom error class with status code
 */
export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Async handler wrapper to catch errors in async route handlers
 */
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

/**
 * 404 Not Found handler
 */
export function notFoundHandler(req: Request, res: Response, next: NextFunction): void {
  const error = new AppError(`Route not found: ${req.originalUrl}`, 404);
  next(error);
}

/**
 * Global error handler
 */
export function errorHandler(
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // Default to 500 if statusCode not set
  const statusCode = err instanceof AppError ? err.statusCode : 500;
  const message = err.message || 'Internal server error';

  // Log error in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Error:', err);
  }

  // Send error response — never expose stack traces outside development
  res.status(statusCode).json({
    success: false,
    error: statusCode >= 500 && process.env.NODE_ENV !== 'development'
      ? 'Internal server error'
      : message,
  });
}
