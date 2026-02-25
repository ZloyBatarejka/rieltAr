import type { UserResponseDto, CreateManagerDto } from '../generated/Api'
import type { Manager, CreateManager } from '@/shared/types'

export function fromApiManager(dto: UserResponseDto): Manager {
  return {
    id: dto.id,
    email: dto.email,
    name: dto.name,
    role: dto.role,
    ownerId: typeof dto.ownerId === 'string' ? dto.ownerId : null,
    phone: typeof dto.phone === 'string' ? dto.phone : null,
    canCreateOwners: dto.canCreateOwners,
    canCreateProperties: dto.canCreateProperties,
    createdAt: dto.createdAt,
  }
}

export function toApiCreateManager(data: CreateManager): CreateManagerDto {
  return {
    email: data.email,
    password: data.password,
    name: data.name,
    canCreateOwners: data.canCreateOwners,
    canCreateProperties: data.canCreateProperties,
  }
}
