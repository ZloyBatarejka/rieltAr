import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Reflector } from '@nestjs/core';
import { RolesGuard } from './roles.guard';

describe('RolesGuard', () => {
  let guard: RolesGuard;

  const mockReflector = {
    getAllAndOverride: jest.fn(),
    get: jest.fn(),
    getAll: jest.fn(),
    getAllAndMerge: jest.fn(),
    resolve: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RolesGuard, { provide: Reflector, useValue: mockReflector }],
    }).compile();

    guard = module.get<RolesGuard>(RolesGuard);
    jest.clearAllMocks();
  });

  function createMockContext(
    user: Record<string, unknown> | null,
  ): ExecutionContext {
    return {
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({ user }),
        getResponse: jest.fn(),
      }),
      getArgs: jest.fn(),
      getArgByIndex: jest.fn(),
      switchToRpc: jest.fn(),
      switchToWs: jest.fn(),
      getType: jest.fn(),
    } satisfies Record<keyof ExecutionContext, jest.Mock>;
  }

  describe('canActivate()', () => {
    it('should allow access when no @Roles() decorator present', () => {
      mockReflector.getAllAndOverride.mockReturnValue(undefined);
      const context = createMockContext({ id: '1', role: 'MANAGER' });

      expect(guard.canActivate(context)).toBe(true);
    });

    it('should allow access when user has required role', () => {
      mockReflector.getAllAndOverride.mockReturnValue(['MANAGER']);
      const context = createMockContext({
        id: '1',
        email: 'admin@rieltar.ru',
        role: 'MANAGER',
      });

      expect(guard.canActivate(context)).toBe(true);
    });

    it('should throw ForbiddenException when user role doesnt match', () => {
      mockReflector.getAllAndOverride.mockReturnValue(['MANAGER']);
      const context = createMockContext({
        id: '1',
        email: 'owner@test.ru',
        role: 'OWNER',
      });

      expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
    });

    it('should throw ForbiddenException when user is missing', () => {
      mockReflector.getAllAndOverride.mockReturnValue(['MANAGER']);
      const context = createMockContext(null);

      expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
    });

    it('should work with multiple roles (any match = allow)', () => {
      mockReflector.getAllAndOverride.mockReturnValue(['MANAGER', 'OWNER']);
      const context = createMockContext({
        id: '1',
        email: 'owner@test.ru',
        role: 'OWNER',
      });

      expect(guard.canActivate(context)).toBe(true);
    });
  });
});
