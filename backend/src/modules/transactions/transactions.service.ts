import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TransactionType, type Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { PropertyScopeService } from '../property-scope/property-scope.service';
import type { AuthUser } from '../auth/auth.types';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import type { TransactionListQueryDto } from './dto/transaction-list-query.dto';

export interface TransactionListItem {
  id: string;
  type: TransactionType;
  amount: number;
  comment: string | null;
  propertyId: string;
  propertyTitle: string;
  ownerId: string;
  ownerName: string;
  createdAt: Date;
}

export interface TransactionsListResult {
  items: TransactionListItem[];
  total: number;
  page: number;
  limit: number;
}

type TransactionForList = Prisma.TransactionGetPayload<{
  include: {
    property: {
      include: {
        owner: {
          include: {
            user: { select: { name: true } };
          };
        };
      };
    };
  };
}>;

@Injectable()
export class TransactionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly propertyScope: PropertyScopeService,
  ) {}

  async create(
    user: AuthUser,
    dto: CreateTransactionDto,
  ): Promise<TransactionListItem> {
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

    const transaction = await this.prisma.transaction.create({
      data: {
        type: dto.type,
        amount,
        comment: dto.comment ?? null,
        stayId: null,
        ownerId: property.ownerId,
        propertyId: property.id,
        payoutId: null,
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

    return this.mapToListItem(transaction);
  }

  async findAll(
    user: AuthUser,
    query: TransactionListQueryDto,
  ): Promise<TransactionsListResult> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;

    const baseWhere = await this.propertyScope.getTransactionWhere(user);

    const filterWhere: Prisma.TransactionWhereInput = {};

    if (query.propertyId) {
      filterWhere.propertyId = query.propertyId;
    }

    if (query.ownerId) {
      filterWhere.ownerId = query.ownerId;
    }

    if (query.type) {
      filterWhere.type = query.type;
    }

    if (query.from || query.to) {
      filterWhere.createdAt = {};
      if (query.from) {
        const fromDate = new Date(query.from);
        if (Number.isNaN(fromDate.getTime())) {
          throw new BadRequestException('Некорректная дата from');
        }
        filterWhere.createdAt.gte = fromDate;
      }
      if (query.to) {
        const toDate = new Date(query.to);
        if (Number.isNaN(toDate.getTime())) {
          throw new BadRequestException('Некорректная дата to');
        }
        filterWhere.createdAt.lte = toDate;
      }
    }

    const where: Prisma.TransactionWhereInput = {
      ...baseWhere,
      ...filterWhere,
    };

    const [transactions, total] = await Promise.all([
      this.prisma.transaction.findMany({
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
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.transaction.count({ where }),
    ]);

    const items = transactions.map((tx) => this.mapToListItem(tx));

    return { items, total, page, limit };
  }

  async remove(user: AuthUser, id: string): Promise<void> {
    await this.ensureAccess(user, id);
    await this.prisma.transaction.delete({ where: { id } });
  }

  private async ensureAccess(
    user: AuthUser,
    transactionId: string,
  ): Promise<void> {
    const txWhere = await this.propertyScope.getTransactionWhere(user);

    const exists = await this.prisma.transaction.findFirst({
      where: {
        ...txWhere,
        id: transactionId,
      },
    });

    if (!exists) {
      throw new NotFoundException('Транзакция не найдена');
    }
  }

  private toNumber(value: Prisma.Decimal | number): number {
    if (typeof value === 'number') {
      return Math.round(value * 100) / 100;
    }
    const num = Number(value);
    return Math.round(num * 100) / 100;
  }

  private mapToListItem(tx: TransactionForList): TransactionListItem {
    return {
      id: tx.id,
      type: tx.type,
      amount: this.toNumber(tx.amount),
      comment: tx.comment,
      propertyId: tx.propertyId,
      propertyTitle: tx.property.title,
      ownerId: tx.ownerId,
      ownerName: tx.property.owner.user.name,
      createdAt: tx.createdAt,
    };
  }
}
