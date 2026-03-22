import type {
  TransactionListItemDto,
  TransactionsListResponseDto,
  TransactionListItemDtoTypeEnum,
} from '../generated/Api'
import type { Transaction, TransactionsList, TransactionType } from '@/shared/types'

const TRANSACTION_TYPES: Record<TransactionListItemDtoTypeEnum, TransactionType> = {
  INCOME: 'INCOME',
  COMMISSION: 'COMMISSION',
  CLEANING: 'CLEANING',
  EXPENSE: 'EXPENSE',
  PAYOUT: 'PAYOUT',
}

function fromApiTransactionItem(dto: TransactionListItemDto): Transaction {
  return {
    id: dto.id,
    type: TRANSACTION_TYPES[dto.type],
    amount: dto.amount,
    comment: typeof dto.comment === 'string' ? dto.comment : null,
    propertyId: dto.propertyId,
    propertyTitle: dto.propertyTitle,
    ownerId: dto.ownerId,
    ownerName: dto.ownerName,
    createdAt: dto.createdAt,
  }
}

export function fromApiTransactionsList(
  dto: TransactionsListResponseDto,
): TransactionsList {
  return {
    items: dto.items.map(fromApiTransactionItem),
    total: dto.total,
  }
}
