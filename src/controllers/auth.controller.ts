import { Router, Request, Response, NextFunction } from 'express';
import { UserService } from '../services/user.service';
import { LoginDto } from '../dtos/LoginDto';
import { CreateUserDto } from '../dtos/CreateUserDto';
import { validateOrReject } from 'class-validator';
import { plainToClass } from 'class-transformer';

const router = Router();
const userSvc = new UserService();

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginDto'
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dto = plainToClass(LoginDto, req.body);
    await validateOrReject(dto);
    const { token, user } = await userSvc.login(dto);
    res.json({ token, user });
  } catch (err) {
    next(err);
  }
});

export default router;
