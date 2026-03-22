import type { StayListItemDto, StaysListResponseDto } from '../generated/Api'
import type { Stay, StaysList } from '@/shared/types'

function fromApiStayItem(dto: StayListItemDto): Stay {
  return {
    id: dto.id,
    propertyId: dto.propertyId,
    propertyTitle: dto.propertyTitle,
    ownerId: dto.ownerId,
    ownerName: dto.ownerName,
    guestName: dto.guestName,
    checkIn: dto.checkIn,
    checkOut: dto.checkOut,
    totalAmount: dto.totalAmount,
    createdAt: dto.createdAt,
  }
}

export function fromApiStaysList(dto: StaysListResponseDto): StaysList {
  return {
    items: dto.items.map(fromApiStayItem),
    total: dto.total,
  }
}
