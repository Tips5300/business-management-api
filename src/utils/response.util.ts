import { Response } from 'express';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: any[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export function sendSuccess<T>(
  res: Response, 
  data: T, 
  message?: string, 
  statusCode: number = 200
): Response {
  const response: ApiResponse<T> = {
    success: true,
    data,
    message
  };
  return res.status(statusCode).json(response);
}

export function sendError(
  res: Response, 
  message: string, 
  errors?: any[], 
  statusCode: number = 400
): Response {
  const response: ApiResponse = {
    success: false,
    message,
    errors
  };
  return res.status(statusCode).json(response);
}

export function sendPaginatedResponse<T>(
  res: Response,
  data: T[],
  pagination: { page: number; limit: number; total: number },
  message?: string
): Response {
  const totalPages = Math.ceil(pagination.total / pagination.limit);
  const response: ApiResponse<T[]> = {
    success: true,
    data,
    message,
    pagination: {
      ...pagination,
      totalPages
    }
  };
  return res.json(response);
}