import type {
  CreateTransactionDto,
  TransactionListItemDto,
  TransactionsListResponseDto,
  TransactionListItemDtoTypeEnum,
} from '../generated/Api'
import {
  TRANSACTION_TYPE_CLEANING,
  TRANSACTION_TYPE_COMMISSION,
  TRANSACTION_TYPE_EXPENSE,
  TRANSACTION_TYPE_INCOME,
  TRANSACTION_TYPE_PAYOUT,
  type CreateTransaction,
  type Transaction,
  type TransactionsList,
  type TransactionType,
} from '@/shared/types'

const TRANSACTION_LIST_ITEM_DTO_TO_DOMAIN: Record<
  TransactionListItemDtoTypeEnum,
  TransactionType
> = {
  INCOME: TRANSACTION_TYPE_INCOME,
  COMMISSION: TRANSACTION_TYPE_COMMISSION,
  CLEANING: TRANSACTION_TYPE_CLEANING,
  EXPENSE: TRANSACTION_TYPE_EXPENSE,
  PAYOUT: TRANSACTION_TYPE_PAYOUT,
}

export function fromApiTransactionItem(dto: TransactionListItemDto): Transaction {
  return {
    id: dto.id,
    type: TRANSACTION_LIST_ITEM_DTO_TO_DOMAIN[dto.type],
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

export function toApiCreateTransaction(data: CreateTransaction): CreateTransactionDto {
  const dto: CreateTransactionDto = {
    propertyId: data.propertyId,
    type: data.type,
    amount: data.amount,
  }
  if (data.comment !== undefined && data.comment.trim() !== '') {
    dto.comment = data.comment.trim()
  }
  return dto
}
