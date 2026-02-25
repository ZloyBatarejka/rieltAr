import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { TransactionType } from '@prisma/client';
import { DashboardService } from './dashboard.service';
import { PrismaService } from '../prisma/prisma.service';
import { PropertyScopeService } from '../property-scope/property-scope.service';
import type { AuthUser } from '../auth/auth.types';
import { DashboardPeriod } from './dto/dashboard-query.dto';

describe('DashboardService', () => {
  let service: DashboardService;
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

  const ownerUser: AuthUser = {
    id: 'user-owner-1',
    email: 'owner@test.com',
    name: 'Иван',
    role: 'OWNER',
    ownerId: 'owner-1',
    canCreateOwners: false,
    canCreateProperties: false,
  };

  const managerUser: AuthUser = {
    id: 'manager-1',
    email: 'manager@test.com',
    name: 'Менеджер',
    role: 'MANAGER',
    ownerId: null,
    canCreateOwners: false,
    canCreateProperties: false,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DashboardService,
        {
          provide: PrismaService,
          useValue: {
            owner: { findFirst: jest.fn() },
            transaction: {
              groupBy: jest.fn(),
              findMany: jest.fn(),
            },
            property: { count: jest.fn() },
            stay: { count: jest.fn() },
          },
        },
        {
          provide: PropertyScopeService,
          useValue: {
            getOwnerWhere: jest.fn().mockResolvedValue({}),
            getPropertyWhere: jest.fn().mockResolvedValue({}),
          },
        },
      ],
    }).compile();

    service = module.get<DashboardService>(DashboardService);
    prisma = module.get<PrismaService>(PrismaService);
    propertyScope = module.get<PropertyScopeService>(PropertyScopeService);
  });

  describe('balance calculation', () => {
    it('calculates balance as INCOME − COMMISSION − CLEANING − EXPENSE − PAYOUT', async () => {
      jest
        .spyOn(prisma.owner, 'findFirst')
        .mockResolvedValue({ id: 'owner-1' } as never);
      jest.spyOn(prisma.transaction, 'groupBy').mockResolvedValue([
        { type: 'INCOME' as TransactionType, _sum: { amount: 50000 } },
        { type: 'COMMISSION' as TransactionType, _sum: { amount: 5000 } },
        { type: 'CLEANING' as TransactionType, _sum: { amount: 2000 } },
        { type: 'EXPENSE' as TransactionType, _sum: { amount: 3000 } },
        { type: 'PAYOUT' as TransactionType, _sum: { amount: 10000 } },
      ] as never);
      jest.spyOn(prisma.transaction, 'findMany').mockResolvedValue([]);
      jest.spyOn(prisma.property, 'count').mockResolvedValue(2);
      jest.spyOn(prisma.stay, 'count').mockResolvedValue(1);

      const result = await service.getForOwner(adminUser, 'owner-1');

      expect(result.balance).toBe(30000); // 50000 - 5000 - 2000 - 3000 - 10000
      expect(result.income).toBe(50000);
      expect(result.expenses).toBe(10000); // 5000 + 2000 + 3000
      expect(result.payouts).toBe(10000);
    });
  });

  describe('period filtering', () => {
    it('applies from/to date filter when provided', async () => {
      jest
        .spyOn(prisma.owner, 'findFirst')
        .mockResolvedValue({ id: 'owner-1' } as never);
      const groupBySpy = jest
        .spyOn(prisma.transaction, 'groupBy')
        .mockResolvedValue([]);
      jest.spyOn(prisma.transaction, 'findMany').mockResolvedValue([]);
      jest.spyOn(prisma.property, 'count').mockResolvedValue(0);
      jest.spyOn(prisma.stay, 'count').mockResolvedValue(0);

      await service.getForOwner(adminUser, 'owner-1', {
        from: '2026-02-01T00:00:00.000Z',
        to: '2026-02-28T23:59:59.999Z',
      });

      expect(groupBySpy).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            createdAt: {
              gte: new Date('2026-02-01T00:00:00.000Z'),
              lte: new Date('2026-02-28T23:59:59.999Z'),
            },
          }),
        }),
      );
    });

    it('throws BadRequest when from is invalid', async () => {
      jest
        .spyOn(prisma.owner, 'findFirst')
        .mockResolvedValue({ id: 'owner-1' } as never);

      await expect(
        service.getForOwner(adminUser, 'owner-1', {
          from: 'invalid-date',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('uses period=month when provided', async () => {
      jest
        .spyOn(prisma.owner, 'findFirst')
        .mockResolvedValue({ id: 'owner-1' } as never);
      const groupBySpy = jest
        .spyOn(prisma.transaction, 'groupBy')
        .mockResolvedValue([]);
      jest.spyOn(prisma.transaction, 'findMany').mockResolvedValue([]);
      jest.spyOn(prisma.property, 'count').mockResolvedValue(0);
      jest.spyOn(prisma.stay, 'count').mockResolvedValue(0);

      await service.getForOwner(adminUser, 'owner-1', {
        period: DashboardPeriod.MONTH,
      });

      const groupByArg = groupBySpy.mock.calls[0]?.[0] as {
        where?: { createdAt?: { gte?: Date; lte?: Date } };
      };
      const createdAt = groupByArg?.where?.createdAt;

      expect(createdAt).toBeDefined();
      expect(createdAt?.gte).toBeInstanceOf(Date);
      expect(createdAt?.lte).toBeInstanceOf(Date);
    });

    it('period=all applies no date filter', async () => {
      jest
        .spyOn(prisma.owner, 'findFirst')
        .mockResolvedValue({ id: 'owner-1' } as never);
      const groupBySpy = jest
        .spyOn(prisma.transaction, 'groupBy')
        .mockResolvedValue([]);
      jest.spyOn(prisma.transaction, 'findMany').mockResolvedValue([]);
      jest.spyOn(prisma.property, 'count').mockResolvedValue(0);
      jest.spyOn(prisma.stay, 'count').mockResolvedValue(0);

      await service.getForOwner(adminUser, 'owner-1', {
        period: DashboardPeriod.ALL,
      });

      const groupByArg = groupBySpy.mock.calls[0]?.[0] as {
        where?: { createdAt?: unknown };
      };
      expect(groupByArg?.where?.createdAt).toBeUndefined();
    });
  });

  describe('access', () => {
    it('owner can only access own dashboard', async () => {
      jest
        .spyOn(prisma.owner, 'findFirst')
        .mockResolvedValue({ id: 'owner-1' } as never);
      jest.spyOn(prisma.transaction, 'groupBy').mockResolvedValue([]);
      jest.spyOn(prisma.transaction, 'findMany').mockResolvedValue([]);
      jest.spyOn(prisma.property, 'count').mockResolvedValue(1);
      jest.spyOn(prisma.stay, 'count').mockResolvedValue(0);

      const getOwnerWhereSpy = jest.spyOn(propertyScope, 'getOwnerWhere');
      const result = await service.getForCurrentUser(ownerUser);

      expect(result.propertiesCount).toBe(1);
      expect(getOwnerWhereSpy).toHaveBeenCalledWith(ownerUser);
    });

    it('owner throws NotFound when not owner role', async () => {
      await expect(service.getForCurrentUser(adminUser)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('throws NotFound when owner not in scope (Manager)', async () => {
      jest.spyOn(propertyScope, 'getOwnerWhere').mockResolvedValue({
        id: { in: [] },
      });
      jest.spyOn(prisma.owner, 'findFirst').mockResolvedValue(null);

      await expect(
        service.getForOwner(managerUser, 'owner-unknown'),
      ).rejects.toThrow(NotFoundException);
    });

    it('Admin can access any owner', async () => {
      jest.spyOn(propertyScope, 'getOwnerWhere').mockResolvedValue({});
      jest
        .spyOn(prisma.owner, 'findFirst')
        .mockResolvedValue({ id: 'owner-1' } as never);
      jest.spyOn(prisma.transaction, 'groupBy').mockResolvedValue([]);
      jest.spyOn(prisma.transaction, 'findMany').mockResolvedValue([]);
      jest.spyOn(prisma.property, 'count').mockResolvedValue(3);
      jest.spyOn(prisma.stay, 'count').mockResolvedValue(2);

      const result = await service.getForOwner(adminUser, 'owner-1');

      expect(result.propertiesCount).toBe(3);
      expect(result.activeStaysCount).toBe(2);
    });
  });

  describe('aggregation', () => {
    it('returns correct propertiesCount and activeStaysCount', async () => {
      jest
        .spyOn(prisma.owner, 'findFirst')
        .mockResolvedValue({ id: 'owner-1' } as never);
      jest.spyOn(prisma.transaction, 'groupBy').mockResolvedValue([]);
      jest.spyOn(prisma.transaction, 'findMany').mockResolvedValue([
        {
          id: 'tx-1',
          type: 'INCOME' as TransactionType,
          amount: 10000,
          comment: 'Заезд',
          createdAt: new Date(),
        },
      ] as never);
      jest.spyOn(prisma.property, 'count').mockResolvedValue(5);
      jest.spyOn(prisma.stay, 'count').mockResolvedValue(3);

      const result = await service.getForOwner(adminUser, 'owner-1');

      expect(result.propertiesCount).toBe(5);
      expect(result.activeStaysCount).toBe(3);
      expect(result.lastTransactions).toHaveLength(1);
      expect(result.lastTransactions[0].type).toBe('INCOME');
      expect(result.lastTransactions[0].amount).toBe(10000);
    });
  });
});
