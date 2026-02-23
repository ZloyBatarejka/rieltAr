import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import type { Role } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOwnerDto } from './dto/create-owner.dto';
import { CreateManagerDto } from './dto/create-manager.dto';

const BCRYPT_ROUNDS = 10;

export interface UserResponse {
  id: string;
  email: string;
  name: string;
  role: Role;
  ownerId: string | null;
  phone: string | null;
  canCreateOwners: boolean;
  canCreateProperties: boolean;
  createdAt: Date;
}

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async createOwner(dto: CreateOwnerDto): Promise<UserResponse> {
    await this.ensureEmailAvailable(dto.email);

    const hashedPassword = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        name: dto.name,
        role: 'OWNER',
        owner: {
          create: {
            phone: dto.phone ?? null,
          },
        },
      },
      include: { owner: true },
    });

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      ownerId: user.owner?.id ?? null,
      phone: user.owner?.phone ?? null,
      canCreateOwners: user.canCreateOwners,
      canCreateProperties: user.canCreateProperties,
      createdAt: user.createdAt,
    };
  }

  async createManager(dto: CreateManagerDto): Promise<UserResponse> {
    await this.ensureEmailAvailable(dto.email);

    const hashedPassword = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        name: dto.name,
        role: 'MANAGER',
        canCreateOwners: dto.canCreateOwners ?? false,
        canCreateProperties: dto.canCreateProperties ?? false,
      },
    });

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      ownerId: null,
      phone: null,
      canCreateOwners: user.canCreateOwners,
      canCreateProperties: user.canCreateProperties,
      createdAt: user.createdAt,
    };
  }

  async getManagers(): Promise<UserResponse[]> {
    const managers = await this.prisma.user.findMany({
      where: { role: 'MANAGER' },
      orderBy: { createdAt: 'desc' },
    });

    return managers.map((m) => ({
      id: m.id,
      email: m.email,
      name: m.name,
      role: m.role,
      ownerId: null,
      phone: null,
      canCreateOwners: m.canCreateOwners,
      canCreateProperties: m.canCreateProperties,
      createdAt: m.createdAt,
    }));
  }

  async deleteManager(id: string): Promise<void> {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user || user.role !== 'MANAGER') {
      throw new NotFoundException('Менеджер не найден');
    }

    await this.prisma.user.delete({ where: { id } });
  }

  private async ensureEmailAvailable(email: string): Promise<void> {
    const existing = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      throw new ConflictException('Пользователь с таким email уже существует');
    }
  }
}
