import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database';
import { User } from '../entities/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { LoginDto } from '../dtos/LoginDto';
import { UnauthorizedError } from '../utils/errors';
import { Role } from '../entities/Role';

export class UserService {
    private repo: Repository<User>;
    private roleRepo: Repository<Role>;

    constructor() {
        this.repo = AppDataSource.getRepository(User);
        this.roleRepo = AppDataSource.getRepository(Role);
    }

    // Login: validate credentials, return token + user info
    async login(dto: LoginDto): Promise<{ token: string; user: Partial<User> }> {
        const user = await this.repo.findOne({
            where: { email: dto.email },
            relations: ['role', 'role.permissions'],
            withDeleted: false,
        });
        if (!user) {
            throw new UnauthorizedError('Invalid credentials');
        }

        const isMatch = await bcrypt.compare(dto.password, user.password);
        if (!isMatch) {
            throw new UnauthorizedError('Invalid credentials');
        }

        // Prepare payload: userId and roles array (and optionally permissions)
        const roles = user.role ? [user.role.name] : [];
        // Optionally include permissions in payload:
        const permissions = user.role?.permissions.map(p => ({
            module: p.module,
            action: p.action,
            allowed: p.isAllowed,
        })) || [];

        const payload = {
            userId: user.id,
            roles,
            permissions, // optional: if you want to trust token payload
        };

        const secret = process.env.JWT_SECRET as jwt.Secret;
        if (!secret) {
            throw new Error('JWT_SECRET not set');
        }
        const expiresInRaw = process.env.JWT_EXPIRES_IN || '24h';
        const opts: jwt.SignOptions = {
            expiresIn: expiresInRaw as unknown as jwt.SignOptions['expiresIn'],
        };
        const token = jwt.sign(payload, secret, opts);

        // Return user info without password
        const safeUser: Partial<User> = {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };

        return { token, user: safeUser };
    }
}
