// src/middlewares/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { AppDataSource } from '../config/database';
import { User } from '../entities/User';

dotenv.config();

export interface AuthRequest extends Request {
  user?: {
    userId: number;
    roles?: string[];
    permissions?: { module: string; action: string; allowed: boolean }[];
  };
}

export async function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authorization header missing or malformed' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const secret = process.env.JWT_SECRET!;
    const payload: any = jwt.verify(token, secret);

    const userId = payload.userId;
    // load user with role and permissions
    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOne({
      where: { id: userId },
      relations: ['role', 'role.permissions'],
    });
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }
    const roles = user.role ? [user.role.name] : [];
    const permissions =
      user.role?.permissions.map((p) => ({
        module: p.module,
        action: p.action,
        allowed: p.isAllowed,
      })) || [];

    req.user = { userId, roles, permissions };
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token verification failed' });
  }
}
