import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Reflector } from '@nestjs/core';
import { JwtAuthGuard } from './jwt-auth.guard';

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;

  const mockReflector = {
    getAllAndOverride: jest.fn(),
    get: jest.fn(),
    getAll: jest.fn(),
    getAllAndMerge: jest.fn(),
    resolve: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtAuthGuard,
        { provide: Reflector, useValue: mockReflector },
      ],
    }).compile();

    guard = module.get<JwtAuthGuard>(JwtAuthGuard);
    jest.clearAllMocks();
  });

  function createMockContext(): ExecutionContext {
    return {
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn(),
        getResponse: jest.fn(),
      }),
      getArgs: jest.fn(),
      getArgByIndex: jest.fn(),
      switchToRpc: jest.fn(),
      switchToWs: jest.fn(),
      getType: jest.fn(),
    } satisfies Record<keyof ExecutionContext, jest.Mock>;
  }

  // ─── canActivate() ─────────────────────────────────────

  describe('canActivate()', () => {
    it('should allow access for @Public() endpoints (no token needed)', () => {
      mockReflector.getAllAndOverride.mockReturnValue(true);
      const context = createMockContext();

      const result = guard.canActivate(context);

      expect(result).toBe(true);
      expect(mockReflector.getAllAndOverride).toHaveBeenCalled();
    });
  });

  // ─── handleRequest() ───────────────────────────────────

  describe('handleRequest()', () => {
    it('should return user when valid', () => {
      const user = { id: 'user-uuid', email: 'test@test.ru', role: 'MANAGER' };

      const result = guard.handleRequest(null, user, undefined);

      expect(result).toBe(user);
    });

    it('should throw UnauthorizedException when err is present', () => {
      const err = new Error('Token expired');

      expect(() => guard.handleRequest(err, null, undefined)).toThrow(err);
    });

    it('should throw UnauthorizedException when user is null', () => {
      expect(() => guard.handleRequest(null, null, undefined)).toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException when info contains error', () => {
      const user = { id: 'user-uuid', email: 'test@test.ru', role: 'MANAGER' };

      expect(() => guard.handleRequest(null, user, 'Token expired')).toThrow(
        UnauthorizedException,
      );
    });
  });
});
