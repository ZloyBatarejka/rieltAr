import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { PropertiesService } from './properties.service';
import { PrismaService } from '../prisma/prisma.service';
import { PropertyScopeService } from '../property-scope/property-scope.service';
import type { AuthUser } from '../auth/auth.types';

describe('PropertiesService', () => {
  let service: PropertiesService;
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
        PropertiesService,
        {
          provide: PrismaService,
          useValue: {
            property: {
              findMany: jest.fn(),
              findFirst: jest.fn(),
              findUnique: jest.fn(),
              count: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
            owner: {
              findUnique: jest.fn(),
            },
          },
        },
        {
          provide: PropertyScopeService,
          useValue: {
            getPropertyWhere: jest.fn().mockResolvedValue({}),
          },
        },
      ],
    }).compile();

    service = module.get<PropertiesService>(PropertiesService);
    prisma = module.get<PrismaService>(PrismaService);
    propertyScope = module.get<PropertyScopeService>(PropertyScopeService);
  });

  describe('findAll', () => {
    it('returns paginated list with scope', async () => {
      const mockProperties = [
        {
          id: 'prop-1',
          title: 'Квартира',
          address: 'ул. Тверская, 1',
          ownerId: 'owner-1',
          createdAt: new Date(),
          owner: {
            user: { name: 'Иван' },
          },
        },
      ];
      jest
        .spyOn(prisma.property, 'findMany')
        .mockResolvedValue(mockProperties as never);
      jest.spyOn(prisma.property, 'count').mockResolvedValue(1);
      const getPropertyWhereSpy = jest.spyOn(propertyScope, 'getPropertyWhere');

      const result = await service.findAll(adminUser, 1, 20);

      expect(result.items).toHaveLength(1);
      expect(result.items[0]).toMatchObject({
        id: 'prop-1',
        title: 'Квартира',
        address: 'ул. Тверская, 1',
        ownerId: 'owner-1',
        ownerName: 'Иван',
      });
      expect(result.total).toBe(1);
      expect(getPropertyWhereSpy).toHaveBeenCalledWith(adminUser);
    });
  });

  describe('findOne', () => {
    it('returns property detail when found', async () => {
      const mockProperty = {
        id: 'prop-1',
        title: 'Квартира',
        address: 'ул. Тверская, 1',
        ownerId: 'owner-1',
        createdAt: new Date('2026-01-01'),
        owner: {
          user: { name: 'Иван Иванов' },
        },
      };
      jest.spyOn(propertyScope, 'getPropertyWhere').mockResolvedValue({});
      jest
        .spyOn(prisma.property, 'findFirst')
        .mockResolvedValue(mockProperty as never);

      const result = await service.findOne(adminUser, 'prop-1');

      expect(result).toEqual({
        id: 'prop-1',
        title: 'Квартира',
        address: 'ул. Тверская, 1',
        ownerId: 'owner-1',
        ownerName: 'Иван Иванов',
        createdAt: mockProperty.createdAt,
      });
    });

    it('throws NotFound when property not in scope', async () => {
      jest
        .spyOn(propertyScope, 'getPropertyWhere')
        .mockResolvedValue({ id: { in: [] } });
      jest.spyOn(prisma.property, 'findFirst').mockResolvedValue(null);

      await expect(service.findOne(adminUser, 'prop-1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    it('creates property when owner exists', async () => {
      const owner = {
        id: 'owner-1',
        user: { name: 'Иван' },
      };
      const createdProperty = {
        id: 'prop-1',
        title: 'Квартира',
        address: 'ул. Тверская, 1',
        ownerId: 'owner-1',
        createdAt: new Date(),
        owner: { user: { name: 'Иван' } },
      };
      jest.spyOn(prisma.owner, 'findUnique').mockResolvedValue(owner as never);
      jest
        .spyOn(prisma.property, 'create')
        .mockResolvedValue(createdProperty as never);

      const result = await service.create(adminUser, {
        title: 'Квартира',
        address: 'ул. Тверская, 1',
        ownerId: 'owner-1',
      });

      expect(result.id).toBe('prop-1');
      expect(result.title).toBe('Квартира');
    });
  });
});
