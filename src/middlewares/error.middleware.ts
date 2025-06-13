import { Request, Response, NextFunction } from 'express';
import { ValidationError } from 'class-validator';
import { logger } from '../config/logger';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  logger.error('Error occurred:', {
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
  });

  // Handle validation errors
  if (Array.isArray(err) && err[0] instanceof ValidationError) {
    const formatted = err.map((error: ValidationError) => ({
      property: error.property,
      constraints: error.constraints,
    }));
    return res.status(400).json({ errors: formatted });
  }

  // Handle custom errors with status
  if (err.status) {
    return res.status(err.status).json({ error: err.message });
  }

  // Handle TypeORM errors
  if (err.name === 'QueryFailedError') {
    if (err.message.includes('UNIQUE constraint failed')) {
      return res.status(400).json({ error: 'Duplicate entry found' });
    }
    if (err.message.includes('FOREIGN KEY constraint failed')) {
      return res.status(400).json({ error: 'Referenced record not found' });
    }
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'Invalid token' });
  }
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ error: 'Token expired' });
  }

  // Default error
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  return res.status(status).json({ error: message });
}