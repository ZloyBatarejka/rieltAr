import type {
  CreatePayoutDto,
  PayoutListItemDto,
  PayoutsListResponseDto,
} from '../generated/Api'
import type { CreatePayout, Payout, PayoutsList } from '@/shared/types'

export function fromApiPayoutItem(dto: PayoutListItemDto): Payout {
  return {
    id: dto.id,
    ownerId: dto.ownerId,
    ownerName: dto.ownerName,
    propertyId: dto.propertyId,
    propertyTitle: dto.propertyTitle,
    amount: dto.amount,
    comment: typeof dto.comment === 'string' ? dto.comment : null,
    paidAt: dto.paidAt,
    createdAt: dto.createdAt,
  }
}

export function fromApiPayoutsList(dto: PayoutsListResponseDto): PayoutsList {
  return {
    items: dto.items.map(fromApiPayoutItem),
    total: dto.total,
  }
}

export function toApiCreatePayout(data: CreatePayout): CreatePayoutDto {
  const dto: CreatePayoutDto = {
    propertyId: data.propertyId,
    amount: data.amount,
  }
  if (data.comment && data.comment.trim() !== '') {
    dto.comment = data.comment.trim()
  }
  return dto
}
