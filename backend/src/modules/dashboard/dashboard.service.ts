import { Injectable, NotFoundException } from '@nestjs/common';
import { TransactionType, type Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { PropertyScopeService } from '../property-scope/property-scope.service';
import type { AuthUser } from '../auth/auth.types';

export interface DashboardTransaction {
  id: string;
  type: TransactionType;
  amount: number;
  comment: string | null;
  createdAt: Date;
}

export interface DashboardData {
  balance: number;
  income: number;
  expenses: number;
  payouts: number;
  lastTransactions: DashboardTransaction[];
  propertiesCount: number;
  activeStaysCount: number;
}

const TYPE_SIGN: Record<TransactionType, number> = {
  INCOME: 1,
  COMMISSION: -1,
  CLEANING: -1,
  EXPENSE: -1,
  PAYOUT: -1,
};

@Injectable()
export class DashboardService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly propertyScope: PropertyScopeService,
  ) {}

  async getForOwner(user: AuthUser, ownerId: string): Promise<DashboardData> {
    await this.ensureAccess(user, ownerId);

    const propertyWhere = await this.propertyScope.getPropertyWhere(user);
    const transactionWhere: Prisma.TransactionWhereInput = {
      ownerId,
      property: propertyWhere,
    };

    const [txGroups, lastTransactions, propertiesCount, activeStaysCount] =
      await Promise.all([
        this.prisma.transaction.groupBy({
          by: ['type'],
          where: transactionWhere,
          _sum: { amount: true },
        }),
        this.prisma.transaction.findMany({
          where: transactionWhere,
          orderBy: { createdAt: 'desc' },
          take: 5,
          include: { property: { select: { title: true } } },
        }),
        this.prisma.property.count({
          where: { ownerId, ...propertyWhere },
        }),
        this.getActiveStaysCount(ownerId, propertyWhere),
      ]);

    let balance = 0;
    let income = 0;
    let expenses = 0;
    let payouts = 0;

    for (const g of txGroups) {
      const sum = g._sum.amount ?? 0;
      const num = typeof sum === 'number' ? sum : Number(sum);
      const amount = Math.round(num * 100) / 100;

      balance += TYPE_SIGN[g.type] * amount;

      if (g.type === 'INCOME') {
        income += amount;
      } else if (g.type === 'PAYOUT') {
        payouts += amount;
      } else {
        expenses += amount;
      }
    }

    const lastTx: DashboardTransaction[] = lastTransactions.map((t) => ({
      id: t.id,
      type: t.type,
      amount: this.toNumber(t.amount),
      comment: t.comment,
      createdAt: t.createdAt,
    }));

    return {
      balance: Math.round(balance * 100) / 100,
      income: Math.round(income * 100) / 100,
      expenses: Math.round(expenses * 100) / 100,
      payouts: Math.round(payouts * 100) / 100,
      lastTransactions: lastTx,
      propertiesCount,
      activeStaysCount,
    };
  }

  async getForCurrentUser(user: AuthUser): Promise<DashboardData> {
    if (user.role !== 'OWNER' || !user.ownerId) {
      throw new NotFoundException('Доступно только для собственника');
    }
    return this.getForOwner(user, user.ownerId);
  }

  private async ensureAccess(user: AuthUser, ownerId: string): Promise<void> {
    const ownerWhere = await this.propertyScope.getOwnerWhere(user);
    const exists = await this.prisma.owner.findFirst({
      where: { ...ownerWhere, id: ownerId },
    });
    if (!exists) {
      throw new NotFoundException('Собственник не найден');
    }
  }

  private async getActiveStaysCount(
    ownerId: string,
    propertyWhere: Prisma.PropertyWhereInput,
  ): Promise<number> {
    const now = new Date();
    return this.prisma.stay.count({
      where: {
        property: {
          ownerId,
          ...propertyWhere,
        },
        checkIn: { lte: now },
        checkOut: { gte: now },
      },
    });
  }

  private toNumber(value: Prisma.Decimal | number): number {
    if (typeof value === 'number') {
      return Math.round(value * 100) / 100;
    }
    return Math.round(Number(value) * 100) / 100;
  }
}
