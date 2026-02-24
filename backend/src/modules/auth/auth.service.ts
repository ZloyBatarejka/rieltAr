import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { createHash, randomBytes } from 'crypto';
import * as bcrypt from 'bcrypt';
import type { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import type { AuthUser, LoginResponse, TokenPairResponse } from './auth.types';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  // ─── Private helpers ────────────────────────────────────

  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  private generateAccessToken(
    user: Pick<User, 'id' | 'email' | 'role'>,
  ): string {
    return this.jwtService.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
    });
  }

  private getRefreshExpiresAt(): Date {
    const daysStr = this.configService.get<string>(
      'JWT_REFRESH_EXPIRES_DAYS',
      '7',
    );
    const days = parseInt(daysStr, 10) || 7;
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + days);
    return expiresAt;
  }

  // ─── Public methods ─────────────────────────────────────

  async login(dto: LoginDto): Promise<LoginResponse> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      include: { owner: true },
    });

    if (!user) {
      throw new UnauthorizedException('Неверный email или пароль');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Неверный email или пароль');
    }

    // Удаляем старые refresh-токены (политика одного сеанса)
    await this.prisma.refreshToken.deleteMany({
      where: { userId: user.id },
    });

    const accessToken = this.generateAccessToken(user);
    const refreshToken = randomBytes(64).toString('hex');

    await this.prisma.refreshToken.create({
      data: {
        tokenHash: this.hashToken(refreshToken),
        userId: user.id,
        expiresAt: this.getRefreshExpiresAt(),
      },
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        ownerId: user.owner?.id ?? null,
        canCreateOwners: user.canCreateOwners,
        canCreateProperties: user.canCreateProperties,
      },
    };
  }

  async refresh(refreshTokenValue: string): Promise<TokenPairResponse> {
    const tokenHash = this.hashToken(refreshTokenValue);

    const storedToken = await this.prisma.refreshToken.findUnique({
      where: { tokenHash },
      include: { user: true },
    });

    if (!storedToken || storedToken.expiresAt < new Date()) {
      if (storedToken) {
        await this.prisma.refreshToken.deleteMany({
          where: { id: storedToken.id },
        });
      }
      throw new UnauthorizedException(
        'Недействительный или истёкший refresh-токен',
      );
    }

    // Атомарная ротация: deleteMany не бросает если запись уже удалена (race condition)
    const deleted = await this.prisma.refreshToken.deleteMany({
      where: { id: storedToken.id },
    });

    if (deleted.count === 0) {
      throw new UnauthorizedException(
        'Недействительный или истёкший refresh-токен',
      );
    }

    const accessToken = this.generateAccessToken(storedToken.user);
    const newRefreshToken = randomBytes(64).toString('hex');

    await this.prisma.refreshToken.create({
      data: {
        tokenHash: this.hashToken(newRefreshToken),
        userId: storedToken.userId,
        expiresAt: this.getRefreshExpiresAt(),
      },
    });

    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  }

  async logout(userId: string): Promise<void> {
    await this.prisma.refreshToken.deleteMany({
      where: { userId },
    });
  }

  async getMe(userId: string): Promise<AuthUser> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { owner: true },
    });

    if (!user) {
      throw new UnauthorizedException('Пользователь не найден');
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      ownerId: user.owner?.id ?? null,
      canCreateOwners: user.canCreateOwners,
      canCreateProperties: user.canCreateProperties,
    };
  }
}
