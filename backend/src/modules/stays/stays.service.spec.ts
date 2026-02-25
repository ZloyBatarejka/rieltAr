import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { TransactionType } from '@prisma/client';
import { StaysService } from './stays.service';
import { PrismaService } from '../prisma/prisma.service';
import { PropertyScopeService } from '../property-scope/property-scope.service';
import type { AuthUser } from '../auth/auth.types';

describe('StaysService', () => {
  let service: StaysService;
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
      id: 'owner-1',
      user: { name: 'Иван Иванов' },
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StaysService,
        {
          provide: PrismaService,
          useValue: {
            property: { findFirst: jest.fn() },
            stay: {
              findMany: jest.fn(),
              findFirst: jest.fn(),
              findUnique: jest.fn(),
              delete: jest.fn(),
            },
            transaction: { createMany: jest.fn() },
            $transaction: jest.fn(),
          },
        },
        {
          provide: PropertyScopeService,
          useValue: {
            getPropertyWhere: jest.fn().mockResolvedValue({}),
            getStayWhere: jest.fn().mockResolvedValue({}),
          },
        },
      ],
    }).compile();

    service = module.get<StaysService>(StaysService);
    prisma = module.get<PrismaService>(PrismaService);
    propertyScope = module.get<PropertyScopeService>(PropertyScopeService);
  });

  describe('create', () => {
    it('creates stay with INCOME and optional COMMISSION, CLEANING in one transaction', async () => {
      const checkIn = '2026-02-24T15:00:00.000Z';
      const checkOut = '2026-02-28T11:00:00.000Z';
      const dto = {
        propertyId: 'prop-1',
        guestName: 'Гость',
        checkIn,
        checkOut,
        totalAmount: 25000,
        commissionPercent: 10,
        cleaningAmount: 1500,
      };

      jest
        .spyOn(prisma.property, 'findFirst')
        .mockResolvedValue(mockProperty as never);

      const createdStay = {
        id: 'stay-1',
        propertyId: 'prop-1',
        guestName: 'Гость',
        checkIn: new Date(checkIn),
        checkOut: new Date(checkOut),
        totalAmount: 25000,
        createdAt: new Date(),
        property: {
          ...mockProperty,
          title: 'Квартира',
          owner: {
            ...mockProperty.owner,
            user: { name: 'Иван Иванов' },
          },
        },
        transactions: [
          {
            id: 'tx-1',
            type: 'INCOME' as TransactionType,
            amount: 25000,
            comment: null,
            createdAt: new Date(),
          },
          {
            id: 'tx-2',
            type: 'COMMISSION' as TransactionType,
            amount: 2500,
            comment: null,
            createdAt: new Date(),
          },
          {
            id: 'tx-3',
            type: 'CLEANING' as TransactionType,
            amount: 1500,
            comment: null,
            createdAt: new Date(),
          },
        ],
      };

      const txMock = {
        stay: {
          create: jest.fn().mockResolvedValue({ id: 'stay-1' }),
          findUnique: jest.fn().mockResolvedValue(createdStay),
        },
        transaction: { createMany: jest.fn().mockResolvedValue({ count: 3 }) },
      };

      jest
        .spyOn(prisma, '$transaction')
        .mockImplementation(
          (fn: (tx: unknown) => Promise<unknown>) => fn(txMock) as never,
        );

      const result = await service.create(adminUser, dto);

      expect(result.id).toBe('stay-1');
      expect(result.guestName).toBe('Гость');
      expect(result.transactions).toHaveLength(3);
      expect(result.transactions.map((t) => t.type)).toEqual([
        'INCOME',
        'COMMISSION',
        'CLEANING',
      ]);
      expect(txMock.transaction.createMany).toHaveBeenCalled();
    });

    it('throws BadRequest when checkOut <= checkIn', async () => {
      jest
        .spyOn(prisma.property, 'findFirst')
        .mockResolvedValue(mockProperty as never);

      await expect(
        service.create(adminUser, {
          propertyId: 'prop-1',
          guestName: 'Гость',
          checkIn: '2026-02-28T15:00:00.000Z',
          checkOut: '2026-02-24T11:00:00.000Z',
          totalAmount: 10000,
        }),
      ).rejects.toThrow(BadRequestException);
      await expect(
        service.create(adminUser, {
          propertyId: 'prop-1',
          guestName: 'Гость',
          checkIn: '2026-02-28T15:00:00.000Z',
          checkOut: '2026-02-24T11:00:00.000Z',
          totalAmount: 10000,
        }),
      ).rejects.toThrow('Дата выезда должна быть позже даты заезда');
    });

    it('throws NotFound when property not in scope', async () => {
      jest.spyOn(prisma.property, 'findFirst').mockResolvedValue(null);

      await expect(
        service.create(adminUser, {
          propertyId: 'prop-unknown',
          guestName: 'Гость',
          checkIn: '2026-02-24T15:00:00.000Z',
          checkOut: '2026-02-28T11:00:00.000Z',
          totalAmount: 10000,
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('deletes stay when in scope', async () => {
      jest.spyOn(propertyScope, 'getStayWhere').mockResolvedValue({});
      jest
        .spyOn(prisma.stay, 'findFirst')
        .mockResolvedValue({ id: 'stay-1' } as never);
      const deleteSpy = jest
        .spyOn(prisma.stay, 'delete')
        .mockResolvedValue({} as never);

      await service.remove(adminUser, 'stay-1');

      expect(deleteSpy).toHaveBeenCalledWith({
        where: { id: 'stay-1' },
      });
    });

    it('throws NotFound when stay not in scope', async () => {
      jest
        .spyOn(propertyScope, 'getStayWhere')
        .mockResolvedValue({ property: { id: { in: [] } } });
      jest.spyOn(prisma.stay, 'findFirst').mockResolvedValue(null);

      await expect(service.remove(adminUser, 'stay-1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
