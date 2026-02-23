import { Injectable } from '@nestjs/common';
import type { Prisma } from '@prisma/client';
import type { AuthUser } from '../auth/auth.types';
import { ManagerPropertiesService } from '../manager-properties/manager-properties.service';

/**
 * Утилита скоупинга данных по ролям.
 * ADMIN — без фильтра, MANAGER — только назначенные объекты, OWNER — только свои.
 */
@Injectable()
export class PropertyScopeService {
  constructor(
    private readonly managerPropertiesService: ManagerPropertiesService,
  ) {}

  async getAssignedPropertyIds(userId: string): Promise<string[]> {
    return this.managerPropertiesService.getAssignedPropertyIds(userId);
  }

  async getPropertyWhere(user: AuthUser): Promise<Prisma.PropertyWhereInput> {
    if (user.role === 'ADMIN') return {};
    if (user.role === 'OWNER' && user.ownerId) {
      return { ownerId: user.ownerId };
    }
    if (user.role === 'MANAGER') {
      const ids = await this.getAssignedPropertyIds(user.id);
      return ids.length > 0 ? { id: { in: ids } } : { id: { in: [] } };
    }
    return { id: { in: [] } };
  }

  async getOwnerWhere(user: AuthUser): Promise<Prisma.OwnerWhereInput> {
    if (user.role === 'ADMIN') return {};
    if (user.role === 'OWNER' && user.ownerId) {
      return { id: user.ownerId };
    }
    if (user.role === 'MANAGER') {
      const propertyIds = await this.getAssignedPropertyIds(user.id);
      return propertyIds.length > 0
        ? { properties: { some: { id: { in: propertyIds } } } }
        : { id: { in: [] } };
    }
    return { id: { in: [] } };
  }

  async getStayWhere(user: AuthUser): Promise<Prisma.StayWhereInput> {
    const propertyWhere = await this.getPropertyWhere(user);
    return { property: propertyWhere };
  }

  async getTransactionWhere(
    user: AuthUser,
  ): Promise<Prisma.TransactionWhereInput> {
    const propertyWhere = await this.getPropertyWhere(user);
    return { property: propertyWhere };
  }

  async getPayoutWhere(user: AuthUser): Promise<Prisma.PayoutWhereInput> {
    const propertyWhere = await this.getPropertyWhere(user);
    return { property: propertyWhere };
  }
}
