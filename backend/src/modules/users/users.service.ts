import { ConflictException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';

const BCRYPT_ROUNDS = 10;

export interface UserWithOwner {
  id: string;
  email: string;
  name: string;
  role: 'MANAGER' | 'OWNER';
  ownerId: string | null;
  phone: string | null;
  createdAt: Date;
}

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async createOwner(dto: CreateUserDto): Promise<UserWithOwner> {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existing) {
      throw new ConflictException('Пользователь с таким email уже существует');
    }

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
      createdAt: user.createdAt,
    };
  }
}
