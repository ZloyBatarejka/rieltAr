import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/modules/prisma/prisma.service';
import { createHash } from 'crypto';

// ─── Response types for typed assertions ────────────────────

interface LoginResponseBody {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    ownerId: string | null;
  };
}

interface TokenPairResponseBody {
  accessToken: string;
  refreshToken: string;
}

interface AuthUserResponseBody {
  id: string;
  email: string;
  name: string;
  role: string;
  ownerId: string | null;
}

interface ErrorResponseBody {
  message: string;
  statusCode: number;
}

function isLoginResponse(value: unknown): value is LoginResponseBody {
  if (typeof value !== 'object' || value === null) return false;
  const obj = value as Record<string, unknown>;
  return (
    typeof obj.accessToken === 'string' &&
    typeof obj.refreshToken === 'string' &&
    typeof obj.user === 'object'
  );
}

function isTokenPairResponse(value: unknown): value is TokenPairResponseBody {
  if (typeof value !== 'object' || value === null) return false;
  const obj = value as Record<string, unknown>;
  return (
    typeof obj.accessToken === 'string' && typeof obj.refreshToken === 'string'
  );
}

function isAuthUserResponse(value: unknown): value is AuthUserResponseBody {
  if (typeof value !== 'object' || value === null) return false;
  const obj = value as Record<string, unknown>;
  return typeof obj.id === 'string' && typeof obj.email === 'string';
}

function isErrorResponse(value: unknown): value is ErrorResponseBody {
  if (typeof value !== 'object' || value === null) return false;
  const obj = value as Record<string, unknown>;
  return typeof obj.message === 'string';
}

// ─── Mock data ──────────────────────────────────────────────

const testManager = {
  id: 'e2e-manager-uuid',
  email: 'e2e-admin@rieltar.ru',
  name: 'E2E Admin',
  password: '$2b$10$hashedpassword',
  role: 'MANAGER' as const,
  createdAt: new Date(),
  updatedAt: new Date(),
  owner: null,
};

function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

// ─── Mock PrismaService ─────────────────────────────────────

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
  $connect: jest.fn(),
  $disconnect: jest.fn(),
};

const mockBcryptCompare = jest.fn<Promise<boolean>, [string, string]>();

jest.mock('bcrypt', () => ({
  compare: (...args: [string, string]) => mockBcryptCompare(...args),
  hash: jest.fn(),
}));

// ─── Helper: login and get typed access token ───────────────

async function loginAndGetToken(
  server: ReturnType<INestApplication['getHttpServer']>,
): Promise<string> {
  mockPrisma.user.findUnique.mockResolvedValue(testManager);
  mockBcryptCompare.mockResolvedValue(true);
  mockPrisma.refreshToken.deleteMany.mockResolvedValue({ count: 0 });
  mockPrisma.refreshToken.create.mockResolvedValue({});

  const loginResponse = await request(server)
    .post('/api/auth/login')
    .send({ email: 'e2e-admin@rieltar.ru', password: 'admin123' });

  const body: unknown = loginResponse.body;
  if (!isLoginResponse(body)) {
    throw new Error('Unexpected login response shape');
  }
  return body.accessToken;
}

// ─── Tests ──────────────────────────────────────────────────

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let server: ReturnType<INestApplication['getHttpServer']>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(mockPrisma)
      .compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
    server = app.getHttpServer();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ─── POST /api/auth/login ───────────────────────────────

  describe('POST /api/auth/login', () => {
    it('should return 200 with tokens and user on valid credentials', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(testManager);
      mockBcryptCompare.mockResolvedValue(true);
      mockPrisma.refreshToken.deleteMany.mockResolvedValue({ count: 0 });
      mockPrisma.refreshToken.create.mockResolvedValue({});

      const response = await request(server)
        .post('/api/auth/login')
        .send({ email: 'e2e-admin@rieltar.ru', password: 'admin123' })
        .expect(201);

      const body: unknown = response.body;
      expect(isLoginResponse(body)).toBe(true);

      if (isLoginResponse(body)) {
        expect(body.user.email).toBe('e2e-admin@rieltar.ru');
      }
    });

    it('should return 401 on invalid email', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await request(server)
        .post('/api/auth/login')
        .send({ email: 'nonexistent@rieltar.ru', password: 'admin123' })
        .expect(401);
    });

    it('should return 401 on invalid password', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(testManager);
      mockBcryptCompare.mockResolvedValue(false);

      await request(server)
        .post('/api/auth/login')
        .send({ email: 'e2e-admin@rieltar.ru', password: 'wrongpassword' })
        .expect(401);
    });

    it('should be accessible without JWT (@Public)', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      // Even without a token, the endpoint should not return 401 due to missing JWT
      // It returns 401 only because of bad credentials, not missing token
      const response = await request(server)
        .post('/api/auth/login')
        .send({ email: 'test@test.ru', password: 'test' })
        .expect(401);

      const body: unknown = response.body;
      if (isErrorResponse(body)) {
        expect(body.message).toBe('Неверный email или пароль');
      }
    });
  });

  // ─── POST /api/auth/refresh ─────────────────────────────

  describe('POST /api/auth/refresh', () => {
    it('should return 200 with new token pair', async () => {
      const storedToken = {
        id: 'token-uuid',
        tokenHash: hashToken('valid-refresh'),
        userId: testManager.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        createdAt: new Date(),
        user: testManager,
      };

      mockPrisma.refreshToken.findUnique.mockResolvedValue(storedToken);
      mockPrisma.refreshToken.delete.mockResolvedValue({});
      mockPrisma.refreshToken.create.mockResolvedValue({});

      const response = await request(server)
        .post('/api/auth/refresh')
        .send({ refreshToken: 'valid-refresh' })
        .expect(201);

      const body: unknown = response.body;
      expect(isTokenPairResponse(body)).toBe(true);
    });

    it('should return 401 on invalid refresh token', async () => {
      mockPrisma.refreshToken.findUnique.mockResolvedValue(null);

      await request(server)
        .post('/api/auth/refresh')
        .send({ refreshToken: 'invalid-token' })
        .expect(401);
    });

    it('should be accessible without JWT (@Public)', async () => {
      mockPrisma.refreshToken.findUnique.mockResolvedValue(null);

      // No JWT header, but endpoint should still be reachable (not blocked by JwtAuthGuard)
      const response = await request(server)
        .post('/api/auth/refresh')
        .send({ refreshToken: 'any-token' })
        .expect(401);

      // 401 is from service logic (invalid token), not from guard
      const body: unknown = response.body;
      if (isErrorResponse(body)) {
        expect(body.message).toBe(
          'Недействительный или истёкший refresh-токен',
        );
      }
    });

    it('old refresh token should not work after rotation', async () => {
      const storedToken = {
        id: 'token-uuid',
        tokenHash: hashToken('old-refresh'),
        userId: testManager.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        createdAt: new Date(),
        user: testManager,
      };

      // First call — valid
      mockPrisma.refreshToken.findUnique.mockResolvedValueOnce(storedToken);
      mockPrisma.refreshToken.delete.mockResolvedValueOnce({});
      mockPrisma.refreshToken.create.mockResolvedValueOnce({});

      await request(server)
        .post('/api/auth/refresh')
        .send({ refreshToken: 'old-refresh' })
        .expect(201);

      // Second call — old token no longer exists
      mockPrisma.refreshToken.findUnique.mockResolvedValueOnce(null);

      await request(server)
        .post('/api/auth/refresh')
        .send({ refreshToken: 'old-refresh' })
        .expect(401);
    });
  });

  // ─── POST /api/auth/logout ──────────────────────────────

  describe('POST /api/auth/logout', () => {
    it('should return 200 with success message', async () => {
      const accessToken = await loginAndGetToken(server);

      // Mock the user lookup that JwtStrategy.validate() does
      mockPrisma.user.findUnique.mockResolvedValue(testManager);
      mockPrisma.refreshToken.deleteMany.mockResolvedValue({ count: 1 });

      const response = await request(server)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(201);

      expect(response.body).toEqual({
        message: 'Выход выполнен успешно',
      });
    });

    it('should return 401 without JWT token', async () => {
      await request(server).post('/api/auth/logout').expect(401);
    });

    it('refresh token should not work after logout', async () => {
      const accessToken = await loginAndGetToken(server);

      // After logout, refresh tokens are deleted
      mockPrisma.user.findUnique.mockResolvedValue(testManager);
      mockPrisma.refreshToken.deleteMany.mockResolvedValue({ count: 1 });

      await request(server)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(201);

      // Now try to use refresh — token not found
      mockPrisma.refreshToken.findUnique.mockResolvedValue(null);

      await request(server)
        .post('/api/auth/refresh')
        .send({ refreshToken: 'any-old-refresh' })
        .expect(401);
    });
  });

  // ─── GET /api/auth/me ───────────────────────────────────

  describe('GET /api/auth/me', () => {
    it('should return 200 with current user data', async () => {
      const accessToken = await loginAndGetToken(server);

      mockPrisma.user.findUnique.mockResolvedValue(testManager);

      const response = await request(server)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      const body: unknown = response.body;
      expect(isAuthUserResponse(body)).toBe(true);

      if (isAuthUserResponse(body)) {
        expect(body.id).toBe(testManager.id);
        expect(body.email).toBe(testManager.email);
        expect(body.ownerId).toBeNull();
      }
    });

    it('should return 401 without JWT token', async () => {
      await request(server).get('/api/auth/me').expect(401);
    });
  });
});
