import type {
  PayoutListItemDto,
  PayoutsListResponseDto,
} from '../generated/Api'
import type { Payout, PayoutsList } from '@/shared/types'

function fromApiPayoutItem(dto: PayoutListItemDto): Payout {
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
