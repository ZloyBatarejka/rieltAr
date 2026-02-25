import type {
  OwnerListItemDto,
  OwnerDetailDto,
  OwnersListResponseDto,
  CreateOwnerDto,
  UpdateOwnerDto,
} from '../generated/Api'
import type {
  Owner,
  OwnerDetail,
  OwnersList,
  CreateOwner,
  UpdateOwner,
} from '@/shared/types'

function fromApiOwnerItem(dto: OwnerListItemDto): Owner {
  return {
    id: dto.id,
    name: dto.name,
    phone: typeof dto.phone === 'string' ? dto.phone : null,
    propertiesCount: dto.propertiesCount,
    balance: dto.balance,
    createdAt: dto.createdAt,
  }
}

export function fromApiOwnerDetail(dto: OwnerDetailDto): OwnerDetail {
  return {
    ...fromApiOwnerItem({
      id: dto.id,
      name: dto.name,
      phone: dto.phone,
      propertiesCount: dto.propertiesCount,
      balance: dto.balance,
      createdAt: dto.createdAt,
    }),
    email: dto.email,
  }
}

export function fromApiOwnersList(dto: OwnersListResponseDto): OwnersList {
  return {
    items: dto.items.map(fromApiOwnerItem),
    total: dto.total,
  }
}

export function toApiCreateOwner(data: CreateOwner): CreateOwnerDto {
  return {
    email: data.email,
    password: data.password,
    name: data.name,
    phone: data.phone,
  }
}

export function toApiUpdateOwner(data: UpdateOwner): UpdateOwnerDto {
  return {
    phone: data.phone,
  }
}
