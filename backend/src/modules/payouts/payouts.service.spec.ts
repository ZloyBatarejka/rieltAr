import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { PayoutsService } from './payouts.service';
import { PrismaService } from '../prisma/prisma.service';
import { PropertyScopeService } from '../property-scope/property-scope.service';
import type { AuthUser } from '../auth/auth.types';

describe('PayoutsService', () => {
  let service: PayoutsService;
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
        PayoutsService,
        {
          provide: PrismaService,
          useValue: {
            property: { findFirst: jest.fn() },
            payout: {
              findMany: jest.fn(),
              findFirst: jest.fn(),
              create: jest.fn(),
              delete: jest.fn(),
              count: jest.fn(),
            },
            transaction: { create: jest.fn() },
            $transaction: jest.fn(),
          },
        },
        {
          provide: PropertyScopeService,
          useValue: {
            getPropertyWhere: jest.fn().mockResolvedValue({}),
            getPayoutWhere: jest.fn().mockResolvedValue({}),
          },
        },
      ],
    }).compile();

    service = module.get<PayoutsService>(PayoutsService);
    prisma = module.get<PrismaService>(PrismaService);
    propertyScope = module.get<PropertyScopeService>(PropertyScopeService);
  });

  describe('create', () => {
    it('creates payout and PAYOUT transaction in one Prisma transaction', async () => {
      const createdPayout = {
        id: 'payout-1',
        ownerId: 'owner-1',
        propertyId: 'prop-1',
        amount: 15000,
        comment: 'Выплата за февраль',
        paidAt: new Date('2026-02-24'),
        createdAt: new Date(),
        property: {
          ...mockProperty,
          owner: {
            ...mockProperty.owner,
            user: { name: 'Иван Иванов' },
          },
        },
      };

      jest
        .spyOn(prisma.property, 'findFirst')
        .mockResolvedValue(mockProperty as never);

      const txMock = {
        payout: {
          create: jest.fn().mockResolvedValue(createdPayout),
        },
        transaction: { create: jest.fn().mockResolvedValue({}) },
      };

      jest
        .spyOn(prisma, '$transaction')
        .mockImplementation(
          (fn: (tx: unknown) => Promise<unknown>) => fn(txMock) as never,
        );

      const result = await service.create(adminUser, {
        propertyId: 'prop-1',
        amount: 15000,
        comment: 'Выплата за февраль',
        paidAt: '2026-02-24T12:00:00.000Z',
      });

      expect(result.id).toBe('payout-1');
      expect(result.amount).toBe(15000);
      expect(txMock.transaction.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            type: 'PAYOUT',
            amount: 15000,
            payoutId: 'payout-1',
          }),
        }),
      );
    });

    it('throws BadRequest when paidAt is invalid', async () => {
      jest
        .spyOn(prisma.property, 'findFirst')
        .mockResolvedValue(mockProperty as never);

      await expect(
        service.create(adminUser, {
          propertyId: 'prop-1',
          amount: 10000,
          paidAt: 'invalid-date',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('throws NotFound when property not in scope', async () => {
      jest.spyOn(prisma.property, 'findFirst').mockResolvedValue(null);

      await expect(
        service.create(adminUser, {
          propertyId: 'prop-unknown',
          amount: 10000,
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('deletes payout when in scope', async () => {
      jest.spyOn(propertyScope, 'getPayoutWhere').mockResolvedValue({});
      jest
        .spyOn(prisma.payout, 'findFirst')
        .mockResolvedValue({ id: 'payout-1' } as never);
      const deleteSpy = jest
        .spyOn(prisma.payout, 'delete')
        .mockResolvedValue({} as never);

      await service.remove(adminUser, 'payout-1');

      expect(deleteSpy).toHaveBeenCalledWith({
        where: { id: 'payout-1' },
      });
    });

    it('throws NotFound when payout not in scope', async () => {
      jest
        .spyOn(propertyScope, 'getPayoutWhere')
        .mockResolvedValue({ property: { id: { in: [] } } });
      jest.spyOn(prisma.payout, 'findFirst').mockResolvedValue(null);

      await expect(service.remove(adminUser, 'payout-1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
