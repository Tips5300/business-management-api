// src/middlewares/permission.middleware.ts
import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware';

export function requirePermission(moduleName: string, actionName: string) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    const perms = user.permissions || [];
    const match = perms.find(
      (p) => p.module === moduleName && p.action === actionName && p.allowed,
    );
    if (!match) {
      return res.status(403).json({ error: 'Forbidden: insufficient permission' });
    }
    next();
  };
}
