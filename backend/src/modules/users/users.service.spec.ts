import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';

const mockBcryptHash = jest.fn<Promise<string>, [string, number]>();

jest.mock('bcrypt', () => ({
  hash: (...args: Parameters<typeof mockBcryptHash>) => mockBcryptHash(...args),
}));

describe('UsersService', () => {
  let service: UsersService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
              create: jest.fn(),
              findMany: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prisma = module.get<PrismaService>(PrismaService);
    jest.clearAllMocks();
    mockBcryptHash.mockResolvedValue('$2b$10$hashed');
  });

  describe('createOwner', () => {
    it('creates owner when email is available', async () => {
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null);
      const createdUser = {
        id: 'user-1',
        email: 'owner@test.com',
        name: 'Иван Иванов',
        role: 'OWNER' as const,
        createdAt: new Date(),
        password: 'hashed',
        updatedAt: new Date(),
        canCreateOwners: false,
        canCreateProperties: false,
        owner: {
          id: 'owner-1',
          userId: 'user-1',
          phone: '+7 999',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      };
      jest.spyOn(prisma.user, 'create').mockResolvedValue(createdUser as never);

      const result = await service.createOwner({
        email: 'owner@test.com',
        password: 'password123',
        name: 'Иван Иванов',
        phone: '+7 999',
      });

      expect(result.id).toBe('user-1');
      expect(result.email).toBe('owner@test.com');
      expect(result.name).toBe('Иван Иванов');
      expect(result.role).toBe('OWNER');
      expect(result.ownerId).toBe('owner-1');
      expect(result.phone).toBe('+7 999');
      expect(mockBcryptHash).toHaveBeenCalledWith('password123', 10);
    });

    it('throws ConflictException when email already exists', async () => {
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue({
        id: 'existing',
        email: 'owner@test.com',
      } as never);
      const createSpy = jest.spyOn(prisma.user, 'create');

      await expect(
        service.createOwner({
          email: 'owner@test.com',
          password: 'password123',
          name: 'Иван',
        }),
      ).rejects.toThrow(ConflictException);
      await expect(
        service.createOwner({
          email: 'owner@test.com',
          password: 'password123',
          name: 'Иван',
        }),
      ).rejects.toThrow('Пользователь с таким email уже существует');

      expect(createSpy).not.toHaveBeenCalled();
    });
  });

  describe('createManager', () => {
    it('creates manager with canCreateOwners and canCreateProperties', async () => {
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null);
      const createdUser = {
        id: 'mgr-1',
        email: 'manager@test.com',
        name: 'Менеджер',
        role: 'MANAGER' as const,
        createdAt: new Date(),
        password: 'hashed',
        updatedAt: new Date(),
        canCreateOwners: true,
        canCreateProperties: true,
      };
      jest.spyOn(prisma.user, 'create').mockResolvedValue(createdUser as never);

      const result = await service.createManager({
        email: 'manager@test.com',
        password: 'password123',
        name: 'Менеджер',
        canCreateOwners: true,
        canCreateProperties: true,
      });

      expect(result.id).toBe('mgr-1');
      expect(result.role).toBe('MANAGER');
      expect(result.canCreateOwners).toBe(true);
      expect(result.canCreateProperties).toBe(true);
    });
  });

  describe('deleteManager', () => {
    it('deletes manager when found', async () => {
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue({
        id: 'mgr-1',
        role: 'MANAGER',
      } as never);
      const deleteSpy = jest
        .spyOn(prisma.user, 'delete')
        .mockResolvedValue({} as never);

      await service.deleteManager('mgr-1');

      expect(deleteSpy).toHaveBeenCalledWith({
        where: { id: 'mgr-1' },
      });
    });

    it('throws NotFound when manager not found', async () => {
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null);

      await expect(service.deleteManager('mgr-1')).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.deleteManager('mgr-1')).rejects.toThrow(
        'Менеджер не найден',
      );
    });

    it('throws NotFound when user is not MANAGER', async () => {
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue({
        id: 'owner-1',
        role: 'OWNER',
      } as never);

      await expect(service.deleteManager('owner-1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
