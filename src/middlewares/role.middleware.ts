import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware';

export function requireRoles(...allowedRoles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    const roles = user.roles || [];
    const has = roles.some(r => allowedRoles.includes(r));
    if (!has) {
      return res.status(403).json({ error: 'Forbidden: insufficient role' });
    }
    next();
  };
}
