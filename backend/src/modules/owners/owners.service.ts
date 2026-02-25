import { Injectable, NotFoundException } from '@nestjs/common';
import type { TransactionType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { PropertyScopeService } from '../property-scope/property-scope.service';
import type { AuthUser } from '../auth/auth.types';
import { UpdateOwnerDto } from './dto/update-owner.dto';

export interface OwnerListItem {
  id: string;
  name: string;
  phone: string | null;
  propertiesCount: number;
  balance: number;
  createdAt: Date;
}

export interface OwnerDetail {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  propertiesCount: number;
  balance: number;
  createdAt: Date;
}

export interface OwnersListResult {
  items: OwnerListItem[];
  total: number;
}

@Injectable()
export class OwnersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly propertyScope: PropertyScopeService,
  ) {}

  async findAll(user: AuthUser, search?: string): Promise<OwnersListResult> {
    const where = await this.propertyScope.getOwnerWhere(user);

    const searchWhere = search?.trim()
      ? {
          user: {
            name: { contains: search.trim(), mode: 'insensitive' as const },
          },
        }
      : {};

    const combinedWhere = { ...where, ...searchWhere };

    const [owners, total] = await Promise.all([
      this.prisma.owner.findMany({
        where: combinedWhere,
        include: {
          user: { select: { name: true } },
          _count: { select: { properties: true } },
        },
        orderBy: { user: { name: 'asc' } },
      }),
      this.prisma.owner.count({ where: combinedWhere }),
    ]);

    const balances = await Promise.all(
      owners.map((o) => this.calculateBalance(o.id)),
    );

    const items: OwnerListItem[] = owners.map((o, i) => ({
      id: o.id,
      name: o.user.name,
      phone: o.phone,
      propertiesCount: o._count.properties,
      balance: balances[i],
      createdAt: o.createdAt,
    }));

    return { items, total };
  }

  async findOne(user: AuthUser, id: string): Promise<OwnerDetail> {
    const where = await this.propertyScope.getOwnerWhere(user);

    const owner = await this.prisma.owner.findFirst({
      where: { ...where, id },
      include: {
        user: { select: { name: true, email: true } },
        _count: { select: { properties: true } },
      },
    });

    if (!owner) {
      throw new NotFoundException('Собственник не найден');
    }

    const balance = await this.calculateBalance(owner.id);

    return {
      id: owner.id,
      name: owner.user.name,
      email: owner.user.email,
      phone: owner.phone,
      propertiesCount: owner._count.properties,
      balance,
      createdAt: owner.createdAt,
    };
  }

  async update(
    user: AuthUser,
    id: string,
    dto: UpdateOwnerDto,
  ): Promise<OwnerDetail> {
    await this.ensureAccess(user, id);

    const owner = await this.prisma.owner.update({
      where: { id },
      data: { phone: dto.phone },
      include: {
        user: { select: { name: true, email: true } },
        _count: { select: { properties: true } },
      },
    });

    const balance = await this.calculateBalance(owner.id);

    return {
      id: owner.id,
      name: owner.user.name,
      email: owner.user.email,
      phone: owner.phone,
      propertiesCount: owner._count.properties,
      balance,
      createdAt: owner.createdAt,
    };
  }

  async remove(user: AuthUser, id: string): Promise<void> {
    await this.ensureAccess(user, id);
    await this.prisma.owner.delete({ where: { id } });
  }

  async calculateBalance(ownerId: string): Promise<number> {
    const groups = await this.prisma.transaction.groupBy({
      by: ['type'],
      where: { ownerId },
      _sum: { amount: true },
    });

    let balance = 0;
    const typeSign: Record<TransactionType, number> = {
      INCOME: 1,
      COMMISSION: -1,
      CLEANING: -1,
      EXPENSE: -1,
      PAYOUT: -1,
    };

    for (const g of groups) {
      const sum = g._sum.amount ?? 0;
      const num = typeof sum === 'object' ? Number(sum) : Number(sum);
      balance += typeSign[g.type] * num;
    }

    return Math.round(balance * 100) / 100;
  }

  private async ensureAccess(user: AuthUser, ownerId: string): Promise<void> {
    const where = await this.propertyScope.getOwnerWhere(user);
    const exists = await this.prisma.owner.findFirst({
      where: { ...where, id: ownerId },
    });
    if (!exists) {
      throw new NotFoundException('Собственник не найден');
    }
  }
}
