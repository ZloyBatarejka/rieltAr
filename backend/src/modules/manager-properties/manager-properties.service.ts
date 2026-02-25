import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AssignPropertyDto } from './dto/assign-property.dto';

export interface ManagerPropertyResponse {
  id: string;
  userId: string;
  propertyId: string;
  userName: string;
  propertyTitle: string;
  propertyAddress: string;
  assignedAt: Date;
}

@Injectable()
export class ManagerPropertiesService {
  constructor(private readonly prisma: PrismaService) {}

  async assign(dto: AssignPropertyDto): Promise<ManagerPropertyResponse> {
    const user = await this.prisma.user.findUnique({
      where: { id: dto.userId },
    });
    if (!user || user.role !== 'MANAGER') {
      throw new NotFoundException('Менеджер не найден');
    }

    const property = await this.prisma.property.findUnique({
      where: { id: dto.propertyId },
    });
    if (!property) {
      throw new NotFoundException('Объект не найден');
    }

    const existing = await this.prisma.managerProperty.findUnique({
      where: {
        userId_propertyId: {
          userId: dto.userId,
          propertyId: dto.propertyId,
        },
      },
    });
    if (existing) {
      throw new ConflictException('Объект уже назначен на этого менеджера');
    }

    const assignment = await this.prisma.managerProperty.create({
      data: {
        userId: dto.userId,
        propertyId: dto.propertyId,
      },
      include: {
        user: { select: { name: true } },
        property: { select: { title: true, address: true } },
      },
    });

    return {
      id: assignment.id,
      userId: assignment.userId,
      propertyId: assignment.propertyId,
      userName: assignment.user.name,
      propertyTitle: assignment.property.title,
      propertyAddress: assignment.property.address,
      assignedAt: assignment.assignedAt,
    };
  }

  async unassign(id: string): Promise<void> {
    const assignment = await this.prisma.managerProperty.findUnique({
      where: { id },
    });
    if (!assignment) {
      throw new NotFoundException('Назначение не найдено');
    }

    await this.prisma.managerProperty.delete({ where: { id } });
  }

  async findAll(
    userId?: string,
    propertyId?: string,
  ): Promise<ManagerPropertyResponse[]> {
    const where: Prisma.ManagerPropertyWhereInput = {};
    if (userId) where.userId = userId;
    if (propertyId) where.propertyId = propertyId;

    const assignments = await this.prisma.managerProperty.findMany({
      where,
      include: {
        user: { select: { name: true } },
        property: { select: { title: true, address: true } },
      },
      orderBy: { assignedAt: 'desc' },
    });

    return assignments.map((a) => ({
      id: a.id,
      userId: a.userId,
      propertyId: a.propertyId,
      userName: a.user.name,
      propertyTitle: a.property.title,
      propertyAddress: a.property.address,
      assignedAt: a.assignedAt,
    }));
  }

  async getAssignedPropertyIds(userId: string): Promise<string[]> {
    const assignments = await this.prisma.managerProperty.findMany({
      where: { userId },
      select: { propertyId: true },
    });

    return assignments.map((a) => a.propertyId);
  }
}
