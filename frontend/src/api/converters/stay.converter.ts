import type { StayListItemDto, StaysListResponseDto, CreateStayDto } from '../generated/Api'
import type { Stay, StaysList, CreateStay } from '@/shared/types'

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

export function toApiCreateStay(data: CreateStay): CreateStayDto {
  return {
    propertyId: data.propertyId,
    guestName: data.guestName,
    checkIn: data.checkIn,
    checkOut: data.checkOut,
    totalAmount: data.totalAmount,
    commissionPercent: data.commissionPercent,
    cleaningAmount: data.cleaningAmount,
    incomeComment: data.incomeComment,
    commissionComment: data.commissionComment,
    cleaningComment: data.cleaningComment,
  }
}
