import { Injectable, NotFoundException } from '@nestjs/common';
import type { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { PropertyScopeService } from '../property-scope/property-scope.service';
import type { AuthUser } from '../auth/auth.types';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';

export interface PropertyListItem {
  id: string;
  title: string;
  address: string;
  ownerId: string;
  ownerName: string;
  createdAt: Date;
}

export interface PropertyDetail {
  id: string;
  title: string;
  address: string;
  ownerId: string;
  ownerName: string;
  createdAt: Date;
}

export interface PropertiesListResult {
  items: PropertyListItem[];
  total: number;
}

@Injectable()
export class PropertiesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly propertyScope: PropertyScopeService,
  ) {}

  async findAll(
    user: AuthUser,
    ownerId?: string,
    search?: string,
  ): Promise<PropertiesListResult> {
    const scopeWhere = await this.propertyScope.getPropertyWhere(user);

    const filterWhere: Prisma.PropertyWhereInput = {};
    if (ownerId) filterWhere.ownerId = ownerId;
    if (search?.trim()) {
      filterWhere.OR = [
        { title: { contains: search.trim(), mode: 'insensitive' } },
        { address: { contains: search.trim(), mode: 'insensitive' } },
      ];
    }

    const combinedWhere: Prisma.PropertyWhereInput = {
      ...scopeWhere,
      ...filterWhere,
    };

    const [properties, total] = await Promise.all([
      this.prisma.property.findMany({
        where: combinedWhere,
        include: {
          owner: { include: { user: { select: { name: true } } } },
        },
        orderBy: { title: 'asc' },
      }),
      this.prisma.property.count({ where: combinedWhere }),
    ]);

    const items: PropertyListItem[] = properties.map((p) => ({
      id: p.id,
      title: p.title,
      address: p.address,
      ownerId: p.ownerId,
      ownerName: p.owner.user.name,
      createdAt: p.createdAt,
    }));

    return { items, total };
  }

  async findOne(user: AuthUser, id: string): Promise<PropertyDetail> {
    const scopeWhere = await this.propertyScope.getPropertyWhere(user);

    const property = await this.prisma.property.findFirst({
      where: { ...scopeWhere, id },
      include: {
        owner: { include: { user: { select: { name: true } } } },
      },
    });

    if (!property) {
      throw new NotFoundException('Объект не найден');
    }

    return {
      id: property.id,
      title: property.title,
      address: property.address,
      ownerId: property.ownerId,
      ownerName: property.owner.user.name,
      createdAt: property.createdAt,
    };
  }

  async create(
    _user: AuthUser,
    dto: CreatePropertyDto,
  ): Promise<PropertyDetail> {
    const owner = await this.prisma.owner.findUnique({
      where: { id: dto.ownerId },
      include: { user: { select: { name: true } } },
    });
    if (!owner) {
      throw new NotFoundException('Собственник не найден');
    }

    const property = await this.prisma.property.create({
      data: {
        title: dto.title,
        address: dto.address,
        ownerId: dto.ownerId,
      },
      include: {
        owner: { include: { user: { select: { name: true } } } },
      },
    });

    return {
      id: property.id,
      title: property.title,
      address: property.address,
      ownerId: property.ownerId,
      ownerName: property.owner.user.name,
      createdAt: property.createdAt,
    };
  }

  async update(
    _user: AuthUser,
    id: string,
    dto: UpdatePropertyDto,
  ): Promise<PropertyDetail> {
    await this.ensurePropertyExists(id);

    if (dto.ownerId) {
      const owner = await this.prisma.owner.findUnique({
        where: { id: dto.ownerId },
      });
      if (!owner) {
        throw new NotFoundException('Собственник не найден');
      }
    }

    const data: Partial<UpdatePropertyDto> = {};
    if (dto.title !== undefined) data.title = dto.title;
    if (dto.address !== undefined) data.address = dto.address;
    if (dto.ownerId !== undefined) data.ownerId = dto.ownerId;

    const property = await this.prisma.property.update({
      where: { id },
      data,
      include: {
        owner: { include: { user: { select: { name: true } } } },
      },
    });

    return {
      id: property.id,
      title: property.title,
      address: property.address,
      ownerId: property.ownerId,
      ownerName: property.owner.user.name,
      createdAt: property.createdAt,
    };
  }

  async remove(_user: AuthUser, id: string): Promise<void> {
    await this.ensurePropertyExists(id);
    await this.prisma.property.delete({ where: { id } });
  }

  private async ensurePropertyExists(id: string): Promise<void> {
    const exists = await this.prisma.property.findUnique({
      where: { id },
    });
    if (!exists) {
      throw new NotFoundException('Объект не найден');
    }
  }
}
