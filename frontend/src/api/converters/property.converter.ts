import type {
  PropertyListItemDto,
  PropertyDetailDto,
  PropertiesListResponseDto,
  CreatePropertyDto,
  UpdatePropertyDto,
} from '../generated/Api'
import type {
  Property,
  PropertiesList,
  CreateProperty,
  UpdateProperty,
} from '@/shared/types'

function fromApiPropertyItem(dto: PropertyListItemDto | PropertyDetailDto): Property {
  return {
    id: dto.id,
    title: dto.title,
    address: dto.address,
    ownerId: dto.ownerId,
    ownerName: dto.ownerName,
    createdAt: dto.createdAt,
  }
}

export function fromApiPropertyDetail(dto: PropertyDetailDto): Property {
  return fromApiPropertyItem(dto)
}

export function fromApiPropertiesList(dto: PropertiesListResponseDto): PropertiesList {
  return {
    items: dto.items.map(fromApiPropertyItem),
    total: dto.total,
  }
}

export function toApiCreateProperty(data: CreateProperty): CreatePropertyDto {
  return {
    title: data.title,
    address: data.address,
    ownerId: data.ownerId,
  }
}

export function toApiUpdateProperty(data: UpdateProperty): UpdatePropertyDto {
  return {
    title: data.title,
    address: data.address,
    ownerId: data.ownerId,
  }
}
