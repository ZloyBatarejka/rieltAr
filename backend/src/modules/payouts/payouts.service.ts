import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TransactionType, type Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { PropertyScopeService } from '../property-scope/property-scope.service';
import type { AuthUser } from '../auth/auth.types';
import { CreatePayoutDto } from './dto/create-payout.dto';
import type { PayoutListQueryDto } from './dto/payout-list-query.dto';

export interface PayoutListItem {
  id: string;
  ownerId: string;
  ownerName: string;
  propertyId: string;
  propertyTitle: string;
  amount: number;
  comment: string | null;
  paidAt: Date;
  createdAt: Date;
}

export interface PayoutsListResult {
  items: PayoutListItem[];
  total: number;
  page: number;
  limit: number;
}

type PayoutWithRelations = Prisma.PayoutGetPayload<{
  include: {
    property: {
      include: {
        owner: {
          include: {
            user: {
              select: { name: true };
            };
          };
        };
      };
    };
  };
}>;

@Injectable()
export class PayoutsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly propertyScope: PropertyScopeService,
  ) {}

  async create(user: AuthUser, dto: CreatePayoutDto): Promise<PayoutListItem> {
    const propertyWhere = await this.propertyScope.getPropertyWhere(user);

    const property = await this.prisma.property.findFirst({
      where: {
        ...propertyWhere,
        id: dto.propertyId,
      },
      include: {
        owner: {
          include: {
            user: { select: { name: true } },
          },
        },
      },
    });

    if (!property) {
      throw new NotFoundException('Объект не найден или нет доступа');
    }

    const amount = Math.round(dto.amount * 100) / 100;

    const paidAt = dto.paidAt !== undefined ? new Date(dto.paidAt) : new Date();

    if (Number.isNaN(paidAt.getTime())) {
      throw new BadRequestException('Некорректная дата paidAt');
    }

    const payout = await this.prisma.$transaction(async (tx) => {
      const createdPayout = await tx.payout.create({
        data: {
          ownerId: property.ownerId,
          propertyId: property.id,
          amount,
          comment: dto.comment ?? null,
          paidAt,
        },
        include: {
          property: {
            include: {
              owner: {
                include: {
                  user: { select: { name: true } },
                },
              },
            },
          },
        },
      });

      await tx.transaction.create({
        data: {
          type: TransactionType.PAYOUT,
          amount,
          comment:
            dto.comment ??
            `Выплата собственнику ${createdPayout.property.owner.user.name}`,
          stayId: null,
          ownerId: createdPayout.ownerId,
          propertyId: createdPayout.propertyId,
          payoutId: createdPayout.id,
        },
      });

      return createdPayout;
    });

    return this.mapToListItem(payout);
  }

  async findAll(
    user: AuthUser,
    query: PayoutListQueryDto,
  ): Promise<PayoutsListResult> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;

    const baseWhere = await this.propertyScope.getPayoutWhere(user);

    const filterWhere: Prisma.PayoutWhereInput = {};

    if (query.propertyId) {
      filterWhere.propertyId = query.propertyId;
    }

    if (query.ownerId) {
      filterWhere.ownerId = query.ownerId;
    }

    if (query.from || query.to) {
      filterWhere.paidAt = {};
      if (query.from) {
        const fromDate = new Date(query.from);
        if (Number.isNaN(fromDate.getTime())) {
          throw new BadRequestException('Некорректная дата from');
        }
        filterWhere.paidAt.gte = fromDate;
      }
      if (query.to) {
        const toDate = new Date(query.to);
        if (Number.isNaN(toDate.getTime())) {
          throw new BadRequestException('Некорректная дата to');
        }
        filterWhere.paidAt.lte = toDate;
      }
    }

    const where: Prisma.PayoutWhereInput = {
      ...baseWhere,
      ...filterWhere,
    };

    const [payouts, total] = await Promise.all([
      this.prisma.payout.findMany({
        where,
        include: {
          property: {
            include: {
              owner: {
                include: {
                  user: { select: { name: true } },
                },
              },
            },
          },
        },
        orderBy: { paidAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.payout.count({ where }),
    ]);

    const items = payouts.map((payout) => this.mapToListItem(payout));

    return { items, total, page, limit };
  }

  async remove(user: AuthUser, id: string): Promise<void> {
    await this.ensureAccess(user, id);
    await this.prisma.payout.delete({ where: { id } });
  }

  private async ensureAccess(user: AuthUser, payoutId: string): Promise<void> {
    const payoutWhere = await this.propertyScope.getPayoutWhere(user);

    const exists = await this.prisma.payout.findFirst({
      where: {
        ...payoutWhere,
        id: payoutId,
      },
    });

    if (!exists) {
      throw new NotFoundException('Выплата не найдена');
    }
  }

  private toNumber(value: Prisma.Decimal | number): number {
    if (typeof value === 'number') {
      return Math.round(value * 100) / 100;
    }
    const num = Number(value);
    return Math.round(num * 100) / 100;
  }

  private mapToListItem(payout: PayoutWithRelations): PayoutListItem {
    return {
      id: payout.id,
      ownerId: payout.ownerId,
      ownerName: payout.property.owner.user.name,
      propertyId: payout.propertyId,
      propertyTitle: payout.property.title,
      amount: this.toNumber(payout.amount),
      comment: payout.comment,
      paidAt: payout.paidAt,
      createdAt: payout.createdAt,
    };
  }
}
