import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export interface AuthRequest extends Request {
  user?: { userId: number; roles?: string[] };
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authorization header missing or malformed' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const secret = process.env.JWT_SECRET!;
    const payload: any = jwt.verify(token, secret);
    req.user = { userId: payload.userId, roles: payload.roles || [] };
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token verification failed' });
  }
}