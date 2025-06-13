import { Router, Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { LoginDto } from '../dtos/LoginDto';
import { CreateUserDto } from '../dtos/CreateUserDto';
import { validateOrReject } from 'class-validator';
import { plainToClass } from 'class-transformer';

const router = Router();
const userService = new UserService();

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
router.post('/login', async (req: Request, res: Response) => {
  try {
    const dto = plainToClass(LoginDto, req.body);
    await validateOrReject(dto);
    const { token, user } = await userService.login(dto);
    res.json({ token, user });
  } catch (err: any) {
    if (err.status) {
      return res.status(err.status).json({ error: err.message });
    }
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUserDto'
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Validation error
 */
router.post('/register', async (req: Request, res: Response) => {
  try {
    const dto = plainToClass(CreateUserDto, req.body);
    await validateOrReject(dto);
    const user = await userService.createUser(dto);
    res.status(201).json({ user });
  } catch (err: any) {
    if (err.status) {
      return res.status(err.status).json({ error: err.message });
    }
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;