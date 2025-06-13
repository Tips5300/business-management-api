import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database';
import { User } from '../entities/User';
import { Role } from '../entities/Role';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { LoginDto } from '../dtos/LoginDto';
import { CreateUserDto } from '../dtos/CreateUserDto';
import { UpdateUserDto } from '../dtos/UpdateUserDto';
import { UnauthorizedError, BadRequestError, NotFoundError } from '../utils/errors';
import { BaseService } from './base.service';

export class UserService extends BaseService<User> {
    private roleRepo: Repository<Role>;

    constructor() {
        super({
            entity: User,
            entityName: 'user',
            createDtoClass: CreateUserDto,
            updateDtoClass: UpdateUserDto,
            searchableFields: ['firstName', 'lastName', 'email'],
        });
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

    // Create user with password hashing
    async createUser(dto: CreateUserDto, currentUserId?: number): Promise<Partial<User>> {
        // Check if email already exists
        const existing = await this.repo.findOne({ where: { email: dto.email } });
        if (existing) {
            throw new BadRequestError('Email already exists');
        }

        // Hash password
        const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10);
        const hashedPassword = await bcrypt.hash(dto.password, saltRounds);

        // Get role if provided
        let role: Role | undefined;
        if (dto.role) {
            role = await this.roleRepo.findOne({ where: { id: dto.role } });
            if (!role) {
                throw new BadRequestError('Invalid role');
            }
        }

        const user = this.repo.create({
            email: dto.email,
            password: hashedPassword,
            firstName: dto.firstName,
            lastName: dto.lastName,
            role,
            createdBy: currentUserId,
        });

        const saved = await this.repo.save(user);

        // Return user without password
        const { password, ...safeUser } = saved;
        return safeUser;
    }

    // Update user with optional password hashing
    async updateUser(id: string, dto: UpdateUserDto, currentUserId?: number): Promise<Partial<User>> {
        const user = await this.repo.findOne({ where: { id }, relations: ['role'] });
        if (!user) {
            throw new NotFoundError('User not found');
        }

        // Check email uniqueness if changing
        if (dto.email && dto.email !== user.email) {
            const existing = await this.repo.findOne({ where: { email: dto.email } });
            if (existing) {
                throw new BadRequestError('Email already exists');
            }
        }

        // Hash password if provided
        if (dto.password) {
            const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10);
            dto.password = await bcrypt.hash(dto.password, saltRounds);
        }

        // Get role if provided
        let role: Role | undefined = user.role;
        if (dto.role !== undefined) {
            if (dto.role) {
                role = await this.roleRepo.findOne({ where: { id: dto.role } });
                if (!role) {
                    throw new BadRequestError('Invalid role');
                }
            } else {
                role = undefined;
            }
        }

        const updated = this.repo.merge(user, {
            ...dto,
            role,
            updatedBy: currentUserId,
        });

        const saved = await this.repo.save(updated);

        // Return user without password
        const { password, ...safeUser } = saved;
        return safeUser;
    }

    // Override findOne to exclude password
    async findOne(id: string | number): Promise<Partial<User>> {
        const user = await this.repo.findOne({ 
            where: { id } as any,
            relations: ['role', 'role.permissions']
        });
        if (!user) {
            const err: any = new Error(`${this.entityName} not found`);
            err.status = 404;
            throw err;
        }
        const { password, ...safeUser } = user;
        return safeUser;
    }

    // Override findAll to exclude passwords
    async findAll(queryParams: any): Promise<{
        data: Partial<User>[];
        pagination: { page: number; limit: number; total: number };
    }> {
        const result = await super.findAll(queryParams);
        const safeData = result.data.map(user => {
            const { password, ...safeUser } = user as any;
            return safeUser;
        });
        return { ...result, data: safeData };
    }

    // Override findTrash to exclude passwords
    async findTrash(queryParams: any): Promise<{
        data: Partial<User>[];
        pagination: { page: number; limit: number; total: number };
    }> {
        const result = await super.findTrash(queryParams);
        const safeData = result.data.map(user => {
            const { password, ...safeUser } = user as any;
            return safeUser;
        });
        return { ...result, data: safeData };
    }
}