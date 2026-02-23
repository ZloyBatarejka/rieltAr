import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { OwnersService } from './owners.service';
import { PrismaService } from '../prisma/prisma.service';
import { PropertyScopeService } from '../property-scope/property-scope.service';
import type { AuthUser } from '../auth/auth.types';

describe('OwnersService', () => {
  let service: OwnersService;
  let prisma: PrismaService;
  let propertyScope: PropertyScopeService;

  const adminUser: AuthUser = {
    id: 'admin-1',
    email: 'admin@test.com',
    name: 'Admin',
    role: 'ADMIN',
    ownerId: null,
    canCreateOwners: false,
    canCreateProperties: false,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OwnersService,
        {
          provide: PrismaService,
          useValue: {
            owner: {
              findMany: jest.fn(),
              findFirst: jest.fn(),
              count: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
            transaction: {
              groupBy: jest.fn(),
            },
          },
        },
        {
          provide: PropertyScopeService,
          useValue: {
            getOwnerWhere: jest.fn().mockResolvedValue({}),
          },
        },
      ],
    }).compile();

    service = module.get<OwnersService>(OwnersService);
    prisma = module.get<PrismaService>(PrismaService);
    propertyScope = module.get<PropertyScopeService>(PropertyScopeService);
  });

  describe('findAll', () => {
    it('returns paginated list with scope', async () => {
      const mockOwners = [
        {
          id: 'owner-1',
          phone: '+7 999',
          createdAt: new Date(),
          user: { name: 'Иван' },
          _count: { properties: 2 },
        },
      ];
      jest
        .spyOn(prisma.owner, 'findMany')
        .mockResolvedValue(mockOwners as never);
      jest.spyOn(prisma.owner, 'count').mockResolvedValue(1);
      const balanceSpy = jest.spyOn(service, 'calculateBalance');
      balanceSpy.mockResolvedValue(1000);
      const getOwnerWhereSpy = jest.spyOn(propertyScope, 'getOwnerWhere');

      const result = await service.findAll(adminUser, 1, 20);

      expect(result.items).toHaveLength(1);
      expect(result.total).toBe(1);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(20);
      expect(getOwnerWhereSpy).toHaveBeenCalledWith(adminUser);
    });
  });

  describe('findOne', () => {
    it('returns owner detail with balance when found', async () => {
      const mockOwner = {
        id: 'owner-1',
        phone: '+7 999 123-45-67',
        createdAt: new Date('2026-01-01'),
        user: { name: 'Иван Иванов', email: 'ivan@test.com' },
        _count: { properties: 3 },
      };
      jest.spyOn(propertyScope, 'getOwnerWhere').mockResolvedValue({});
      jest
        .spyOn(prisma.owner, 'findFirst')
        .mockResolvedValue(mockOwner as never);
      jest.spyOn(service, 'calculateBalance').mockResolvedValue(15000.5);

      const result = await service.findOne(adminUser, 'owner-1');

      expect(result).toEqual({
        id: 'owner-1',
        name: 'Иван Иванов',
        email: 'ivan@test.com',
        phone: '+7 999 123-45-67',
        propertiesCount: 3,
        balance: 15000.5,
        createdAt: mockOwner.createdAt,
      });
    });

    it('throws NotFound when owner not in scope', async () => {
      jest
        .spyOn(propertyScope, 'getOwnerWhere')
        .mockResolvedValue({ id: { in: [] } });
      jest.spyOn(prisma.owner, 'findFirst').mockResolvedValue(null);

      await expect(service.findOne(adminUser, 'owner-1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
