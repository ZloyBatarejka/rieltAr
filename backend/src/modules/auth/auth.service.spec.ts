import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { createHash } from 'crypto';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';

// ─── Mock bcrypt ────────────────────────────────────────────
const mockBcryptCompare = jest.fn<Promise<boolean>, [string, string]>();

jest.mock('bcrypt', () => ({
  compare: (...args: [string, string]) => mockBcryptCompare(...args),
}));

// ─── Helpers ────────────────────────────────────────────────

function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

// ─── Mock data ──────────────────────────────────────────────

const managerUser = {
  id: 'manager-uuid',
  email: 'admin@rieltar.ru',
  name: 'Admin',
  password: '$2b$10$hashedpassword',
  role: 'MANAGER' as const,
  createdAt: new Date(),
  updatedAt: new Date(),
  owner: null,
};

const ownerUser = {
  id: 'owner-uuid',
  email: 'owner@test.ru',
  name: 'Owner',
  password: '$2b$10$hashedpassword',
  role: 'OWNER' as const,
  createdAt: new Date(),
  updatedAt: new Date(),
  owner: { id: 'owner-profile-uuid' },
};

// ─── Tests ──────────────────────────────────────────────────

describe('AuthService', () => {
  let service: AuthService;

  const mockPrisma = {
    user: {
      findUnique: jest.fn(),
    },
    refreshToken: {
      create: jest.fn(),
      deleteMany: jest.fn(),
      findUnique: jest.fn(),
      delete: jest.fn(),
    },
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('mock-access-token'),
  };

  const mockConfigService = {
    get: jest.fn().mockReturnValue('7'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);

    // Reset all mocks
    jest.clearAllMocks();
    mockJwtService.sign.mockReturnValue('mock-access-token');
    mockConfigService.get.mockReturnValue('7');
  });

  // ─── login() ────────────────────────────────────────────

  describe('login()', () => {
    it('should return accessToken, refreshToken, user on valid credentials', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(managerUser);
      mockBcryptCompare.mockResolvedValue(true);
      mockPrisma.refreshToken.deleteMany.mockResolvedValue({ count: 0 });
      mockPrisma.refreshToken.create.mockResolvedValue({});

      const result = await service.login({
        email: 'admin@rieltar.ru',
        password: 'admin123',
      });

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
      expect(result).toHaveProperty('user');
      expect(result.accessToken).toBe('mock-access-token');
      expect(result.refreshToken).toBeDefined();
      expect(result.user.email).toBe('admin@rieltar.ru');
    });

    it('should throw UnauthorizedException on wrong email', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(
        service.login({ email: 'wrong@email.com', password: 'any' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException on wrong password', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(managerUser);
      mockBcryptCompare.mockResolvedValue(false);

      await expect(
        service.login({ email: 'admin@rieltar.ru', password: 'wrong' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should delete old refresh tokens on login (single session policy)', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(managerUser);
      mockBcryptCompare.mockResolvedValue(true);
      mockPrisma.refreshToken.deleteMany.mockResolvedValue({ count: 2 });
      mockPrisma.refreshToken.create.mockResolvedValue({});

      await service.login({ email: 'admin@rieltar.ru', password: 'admin123' });

      expect(mockPrisma.refreshToken.deleteMany).toHaveBeenCalledWith({
        where: { userId: managerUser.id },
      });
    });

    it('should store hashed refresh token in DB (SHA-256)', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(managerUser);
      mockBcryptCompare.mockResolvedValue(true);
      mockPrisma.refreshToken.deleteMany.mockResolvedValue({ count: 0 });
      mockPrisma.refreshToken.create.mockResolvedValue({});

      const result = await service.login({
        email: 'admin@rieltar.ru',
        password: 'admin123',
      });

      const expectedHash = hashToken(result.refreshToken);
      expect(mockPrisma.refreshToken.create).toHaveBeenCalledTimes(1);

      // Verify the stored token hash matches SHA-256 of the raw refresh token
      // Using toHaveProperty with path notation to avoid unsafe any access
      expect(mockPrisma.refreshToken.create.mock.calls[0][0]).toHaveProperty(
        'data.tokenHash',
        expectedHash,
      );
      expect(mockPrisma.refreshToken.create.mock.calls[0][0]).toHaveProperty(
        'data.userId',
        managerUser.id,
      );
    });

    it('should return user with ownerId=null for MANAGER role', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(managerUser);
      mockBcryptCompare.mockResolvedValue(true);
      mockPrisma.refreshToken.deleteMany.mockResolvedValue({ count: 0 });
      mockPrisma.refreshToken.create.mockResolvedValue({});

      const result = await service.login({
        email: 'admin@rieltar.ru',
        password: 'admin123',
      });

      expect(result.user.ownerId).toBeNull();
      expect(result.user.role).toBe('MANAGER');
    });

    it('should return user with ownerId for OWNER role', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(ownerUser);
      mockBcryptCompare.mockResolvedValue(true);
      mockPrisma.refreshToken.deleteMany.mockResolvedValue({ count: 0 });
      mockPrisma.refreshToken.create.mockResolvedValue({});

      const result = await service.login({
        email: 'owner@test.ru',
        password: 'pass',
      });

      expect(result.user.ownerId).toBe('owner-profile-uuid');
      expect(result.user.role).toBe('OWNER');
    });
  });

  // ─── refresh() ──────────────────────────────────────────

  describe('refresh()', () => {
    const storedToken = {
      id: 'token-uuid',
      tokenHash: hashToken('valid-refresh-token'),
      userId: managerUser.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      createdAt: new Date(),
      user: managerUser,
    };

    it('should return new accessToken + refreshToken (rotation)', async () => {
      mockPrisma.refreshToken.findUnique.mockResolvedValue(storedToken);
      mockPrisma.refreshToken.delete.mockResolvedValue({});
      mockPrisma.refreshToken.create.mockResolvedValue({});

      const result = await service.refresh('valid-refresh-token');

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
      expect(result.accessToken).toBe('mock-access-token');
      expect(result.refreshToken).toBeDefined();
    });

    it('should delete old refresh token from DB', async () => {
      mockPrisma.refreshToken.findUnique.mockResolvedValue(storedToken);
      mockPrisma.refreshToken.delete.mockResolvedValue({});
      mockPrisma.refreshToken.create.mockResolvedValue({});

      await service.refresh('valid-refresh-token');

      expect(mockPrisma.refreshToken.delete).toHaveBeenCalledWith({
        where: { id: storedToken.id },
      });
    });

    it('should throw UnauthorizedException on invalid token', async () => {
      mockPrisma.refreshToken.findUnique.mockResolvedValue(null);

      await expect(service.refresh('invalid-token')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException on expired token', async () => {
      const expiredToken = {
        ...storedToken,
        expiresAt: new Date(Date.now() - 1000),
      };
      mockPrisma.refreshToken.findUnique.mockResolvedValue(expiredToken);
      mockPrisma.refreshToken.delete.mockResolvedValue({});

      await expect(service.refresh('valid-refresh-token')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should delete expired token from DB when found', async () => {
      const expiredToken = {
        ...storedToken,
        expiresAt: new Date(Date.now() - 1000),
      };
      mockPrisma.refreshToken.findUnique.mockResolvedValue(expiredToken);
      mockPrisma.refreshToken.delete.mockResolvedValue({});

      await expect(service.refresh('valid-refresh-token')).rejects.toThrow(
        UnauthorizedException,
      );

      expect(mockPrisma.refreshToken.delete).toHaveBeenCalledWith({
        where: { id: expiredToken.id },
      });
    });
  });

  // ─── logout() ───────────────────────────────────────────

  describe('logout()', () => {
    it('should delete all refresh tokens for user', async () => {
      mockPrisma.refreshToken.deleteMany.mockResolvedValue({ count: 1 });

      await service.logout('manager-uuid');

      expect(mockPrisma.refreshToken.deleteMany).toHaveBeenCalledWith({
        where: { userId: 'manager-uuid' },
      });
    });
  });

  // ─── getMe() ───────────────────────────────────────────

  describe('getMe()', () => {
    it('should return AuthUser for existing user', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(managerUser);

      const result = await service.getMe('manager-uuid');

      expect(result).toEqual({
        id: managerUser.id,
        email: managerUser.email,
        name: managerUser.name,
        role: managerUser.role,
        ownerId: null,
      });
    });

    it('should throw UnauthorizedException for non-existing user', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(service.getMe('non-existent')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should return ownerId for OWNER role', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(ownerUser);

      const result = await service.getMe('owner-uuid');

      expect(result.ownerId).toBe('owner-profile-uuid');
    });
  });
});
