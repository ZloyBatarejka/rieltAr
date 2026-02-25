import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { TransactionType } from '@prisma/client';
import { TransactionsService } from './transactions.service';
import { PrismaService } from '../prisma/prisma.service';
import { PropertyScopeService } from '../property-scope/property-scope.service';
import type { AuthUser } from '../auth/auth.types';

describe('TransactionsService', () => {
  let service: TransactionsService;
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

  const mockProperty = {
    id: 'prop-1',
    title: 'Квартира',
    ownerId: 'owner-1',
    owner: {
      user: { name: 'Иван Иванов' },
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        {
          provide: PrismaService,
          useValue: {
            property: { findFirst: jest.fn() },
            transaction: {
              findMany: jest.fn(),
              findFirst: jest.fn(),
              create: jest.fn(),
              delete: jest.fn(),
              count: jest.fn(),
            },
          },
        },
        {
          provide: PropertyScopeService,
          useValue: {
            getPropertyWhere: jest.fn().mockResolvedValue({}),
            getTransactionWhere: jest.fn().mockResolvedValue({}),
          },
        },
      ],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
    prisma = module.get<PrismaService>(PrismaService);
    propertyScope = module.get<PropertyScopeService>(PropertyScopeService);
  });

  describe('create', () => {
    it('creates manual transaction when property in scope', async () => {
      const createdTx = {
        id: 'tx-1',
        type: TransactionType.EXPENSE,
        amount: 1500,
        comment: 'Замена смесителя',
        propertyId: 'prop-1',
        ownerId: 'owner-1',
        createdAt: new Date(),
        property: mockProperty,
      };

      jest
        .spyOn(prisma.property, 'findFirst')
        .mockResolvedValue(mockProperty as never);
      jest
        .spyOn(prisma.transaction, 'create')
        .mockResolvedValue(createdTx as never);

      const result = await service.create(adminUser, {
        propertyId: 'prop-1',
        type: TransactionType.EXPENSE,
        amount: 1500,
        comment: 'Замена смесителя',
      });

      expect(result.id).toBe('tx-1');
      expect(result.type).toBe(TransactionType.EXPENSE);
      expect(result.amount).toBe(1500);
    });

    it('throws NotFound when property not in scope', async () => {
      jest.spyOn(prisma.property, 'findFirst').mockResolvedValue(null);

      await expect(
        service.create(adminUser, {
          propertyId: 'prop-unknown',
          type: TransactionType.EXPENSE,
          amount: 1000,
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('returns paginated list with filters', async () => {
      const mockTxs = [
        {
          id: 'tx-1',
          type: TransactionType.INCOME,
          amount: 10000,
          comment: null,
          propertyId: 'prop-1',
          ownerId: 'owner-1',
          createdAt: new Date(),
          property: mockProperty,
        },
      ];

      const getTransactionWhereSpy = jest.spyOn(
        propertyScope,
        'getTransactionWhere',
      );
      jest
        .spyOn(prisma.transaction, 'findMany')
        .mockResolvedValue(mockTxs as never);
      jest.spyOn(prisma.transaction, 'count').mockResolvedValue(1);

      const result = await service.findAll(adminUser, {
        page: 1,
        limit: 20,
        type: TransactionType.INCOME,
      });

      expect(result.items).toHaveLength(1);
      expect(result.total).toBe(1);
      expect(getTransactionWhereSpy).toHaveBeenCalledWith(adminUser);
    });
  });

  describe('remove', () => {
    it('deletes transaction when in scope', async () => {
      jest.spyOn(propertyScope, 'getTransactionWhere').mockResolvedValue({});
      jest
        .spyOn(prisma.transaction, 'findFirst')
        .mockResolvedValue({ id: 'tx-1' } as never);
      const deleteSpy = jest
        .spyOn(prisma.transaction, 'delete')
        .mockResolvedValue({} as never);

      await service.remove(adminUser, 'tx-1');

      expect(deleteSpy).toHaveBeenCalledWith({
        where: { id: 'tx-1' },
      });
    });

    it('throws NotFound when transaction not in scope', async () => {
      jest
        .spyOn(propertyScope, 'getTransactionWhere')
        .mockResolvedValue({ property: { id: { in: [] } } });
      jest.spyOn(prisma.transaction, 'findFirst').mockResolvedValue(null);

      await expect(service.remove(adminUser, 'tx-1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
