import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TransactionType, type Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { PropertyScopeService } from '../property-scope/property-scope.service';
import type { AuthUser } from '../auth/auth.types';
import { CreateStayDto } from './dto/create-stay.dto';
import type { StayListQueryDto } from './dto/stay-list-query.dto';

export interface StayTransaction {
  id: string;
  type: TransactionType;
  amount: number;
  comment: string | null;
  createdAt: Date;
}

export interface StayListItem {
  id: string;
  propertyId: string;
  propertyTitle: string;
  ownerId: string;
  ownerName: string;
  guestName: string;
  checkIn: Date;
  checkOut: Date;
  totalAmount: number;
  createdAt: Date;
}

export interface StayDetail {
  id: string;
  propertyId: string;
  propertyTitle: string;
  ownerId: string;
  ownerName: string;
  guestName: string;
  checkIn: Date;
  checkOut: Date;
  totalAmount: number;
  createdAt: Date;
  transactions: StayTransaction[];
}

export interface StaysListResult {
  items: StayListItem[];
  total: number;
}

type StayWithRelations = Prisma.StayGetPayload<{
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
    transactions: true;
  };
}>;

type StayForList = Prisma.StayGetPayload<{
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
export class StaysService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly propertyScope: PropertyScopeService,
  ) {}

  async create(user: AuthUser, dto: CreateStayDto): Promise<StayDetail> {
    const checkIn = new Date(dto.checkIn);
    const checkOut = new Date(dto.checkOut);

    if (Number.isNaN(checkIn.getTime()) || Number.isNaN(checkOut.getTime())) {
      throw new BadRequestException('Неверный формат дат заезда/выезда');
    }

    if (checkOut <= checkIn) {
      throw new BadRequestException(
        'Дата выезда должна быть позже даты заезда',
      );
    }

    const propertyWhere = await this.propertyScope.getPropertyWhere(user);

    const property = await this.prisma.property.findFirst({
      where: {
        ...propertyWhere,
        id: dto.propertyId,
      },
      include: {
        owner: {
          include: {
            user: {
              select: { name: true },
            },
          },
        },
      },
    });

    if (!property) {
      throw new NotFoundException('Объект не найден или нет доступа');
    }

    const commissionPercent = dto.commissionPercent ?? 0;
    const hasCommission = commissionPercent > 0;
    const hasCleaning =
      typeof dto.cleaningAmount === 'number' && dto.cleaningAmount > 0;

    const result = await this.prisma.$transaction(async (tx) => {
      const stay = await tx.stay.create({
        data: {
          propertyId: dto.propertyId,
          guestName: dto.guestName,
          checkIn,
          checkOut,
          totalAmount: dto.totalAmount,
        },
      });

      const transactionsData: Prisma.TransactionCreateManyInput[] = [];

      transactionsData.push({
        type: TransactionType.INCOME,
        amount: dto.totalAmount,
        comment:
          dto.incomeComment ??
          `Заезд гостя ${dto.guestName} в объект "${property.title}"`,
        stayId: stay.id,
        ownerId: property.ownerId,
        propertyId: property.id,
        payoutId: null,
      });

      if (hasCommission) {
        const commissionRaw = (dto.totalAmount * commissionPercent) / 100;
        const commissionAmount = Math.round(commissionRaw * 100) / 100;

        transactionsData.push({
          type: TransactionType.COMMISSION,
          amount: commissionAmount,
          comment: dto.commissionComment ?? 'Комиссия менеджера',
          stayId: stay.id,
          ownerId: property.ownerId,
          propertyId: property.id,
          payoutId: null,
        });
      }

      if (hasCleaning) {
        const cleaningAmount = dto.cleaningAmount ?? 0;

        transactionsData.push({
          type: TransactionType.CLEANING,
          amount: cleaningAmount,
          comment: dto.cleaningComment ?? 'Уборка после заезда',
          stayId: stay.id,
          ownerId: property.ownerId,
          propertyId: property.id,
          payoutId: null,
        });
      }

      if (transactionsData.length > 0) {
        await tx.transaction.createMany({
          data: transactionsData,
        });
      }

      const fullStay = await tx.stay.findUnique({
        where: { id: stay.id },
        include: {
          property: {
            include: {
              owner: {
                include: {
                  user: {
                    select: { name: true },
                  },
                },
              },
            },
          },
          transactions: {
            orderBy: { createdAt: 'asc' },
          },
        },
      });

      if (!fullStay) {
        throw new NotFoundException('Заезд не найден после создания');
      }

      return fullStay;
    });

    return this.mapToDetail(result);
  }

  async findAll(
    user: AuthUser,
    query: StayListQueryDto,
  ): Promise<StaysListResult> {
    const basePropertyWhere = await this.propertyScope.getPropertyWhere(user);

    const propertyWhere: Prisma.PropertyWhereInput = {
      ...basePropertyWhere,
    };

    if (query.ownerId) {
      propertyWhere.ownerId = query.ownerId;
    }

    if (query.propertyId) {
      propertyWhere.id = query.propertyId;
    }

    const where: Prisma.StayWhereInput = {
      property: propertyWhere,
    };

    if (query.from || query.to) {
      where.checkIn = {};
      where.checkOut = {};

      if (query.from) {
        const fromDate = new Date(query.from);
        if (Number.isNaN(fromDate.getTime())) {
          throw new BadRequestException('Некорректная дата from');
        }
        where.checkIn.gte = fromDate;
      }

      if (query.to) {
        const toDate = new Date(query.to);
        if (Number.isNaN(toDate.getTime())) {
          throw new BadRequestException('Некорректная дата to');
        }
        where.checkOut.lte = toDate;
      }
    }

    if (query.guestName) {
      where.guestName = {
        contains: query.guestName.trim(),
        mode: 'insensitive',
      };
    }

    const [stays, total] = await Promise.all([
      this.prisma.stay.findMany({
        where,
        include: {
          property: {
            include: {
              owner: {
                include: {
                  user: {
                    select: { name: true },
                  },
                },
              },
            },
          },
        },
        orderBy: { checkIn: 'desc' },
      }),
      this.prisma.stay.count({ where }),
    ]);

    const items = stays.map((stay) => this.mapToListItem(stay));

    return { items, total };
  }

  async findOne(user: AuthUser, id: string): Promise<StayDetail> {
    const stayWhere = await this.propertyScope.getStayWhere(user);

    const stay = await this.prisma.stay.findFirst({
      where: {
        ...stayWhere,
        id,
      },
      include: {
        property: {
          include: {
            owner: {
              include: {
                user: {
                  select: { name: true },
                },
              },
            },
          },
        },
        transactions: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!stay) {
      throw new NotFoundException('Заезд не найден');
    }

    return this.mapToDetail(stay);
  }

  async remove(user: AuthUser, id: string): Promise<void> {
    await this.ensureAccess(user, id);
    await this.prisma.stay.delete({ where: { id } });
  }

  private async ensureAccess(user: AuthUser, stayId: string): Promise<void> {
    const stayWhere = await this.propertyScope.getStayWhere(user);

    const exists = await this.prisma.stay.findFirst({
      where: {
        ...stayWhere,
        id: stayId,
      },
    });

    if (!exists) {
      throw new NotFoundException('Заезд не найден');
    }
  }

  private toNumber(value: Prisma.Decimal | number): number {
    if (typeof value === 'number') {
      return Math.round(value * 100) / 100;
    }
    const num = Number(value);
    return Math.round(num * 100) / 100;
  }

  private mapToListItem(stay: StayForList): StayListItem {
    return {
      id: stay.id,
      propertyId: stay.propertyId,
      propertyTitle: stay.property.title,
      ownerId: stay.property.ownerId,
      ownerName: stay.property.owner.user.name,
      guestName: stay.guestName,
      checkIn: stay.checkIn,
      checkOut: stay.checkOut,
      totalAmount: this.toNumber(stay.totalAmount),
      createdAt: stay.createdAt,
    };
  }

  private mapToDetail(stay: StayWithRelations): StayDetail {
    const transactions: StayTransaction[] = stay.transactions.map(
      (transaction) => ({
        id: transaction.id,
        type: transaction.type,
        amount: this.toNumber(transaction.amount),
        comment: transaction.comment,
        createdAt: transaction.createdAt,
      }),
    );

    return {
      id: stay.id,
      propertyId: stay.propertyId,
      propertyTitle: stay.property.title,
      ownerId: stay.property.ownerId,
      ownerName: stay.property.owner.user.name,
      guestName: stay.guestName,
      checkIn: stay.checkIn,
      checkOut: stay.checkOut,
      totalAmount: this.toNumber(stay.totalAmount),
      createdAt: stay.createdAt,
      transactions,
    };
  }
}
