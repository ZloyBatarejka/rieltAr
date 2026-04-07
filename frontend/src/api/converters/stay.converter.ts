import type {
  StayDetailDto,
  StayListItemDto,
  StayTransactionDto,
  StaysListResponseDto,
  StayTransactionDtoTypeEnum,
  CreateStayDto,
} from '../generated/Api'
import {
  TRANSACTION_TYPE_CLEANING,
  TRANSACTION_TYPE_COMMISSION,
  TRANSACTION_TYPE_EXPENSE,
  TRANSACTION_TYPE_INCOME,
  TRANSACTION_TYPE_PAYOUT,
  type CreateStay,
  type Stay,
  type StayDetail,
  type StayTransaction,
  type StaysList,
  type TransactionType,
} from '@/shared/types'

const STAY_TRANSACTION_DTO_TO_DOMAIN: Record<
  StayTransactionDtoTypeEnum,
  TransactionType
> = {
  INCOME: TRANSACTION_TYPE_INCOME,
  COMMISSION: TRANSACTION_TYPE_COMMISSION,
  CLEANING: TRANSACTION_TYPE_CLEANING,
  EXPENSE: TRANSACTION_TYPE_EXPENSE,
  PAYOUT: TRANSACTION_TYPE_PAYOUT,
}

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

function fromApiStayTransaction(dto: StayTransactionDto): StayTransaction {
  return {
    id: dto.id,
    type: STAY_TRANSACTION_DTO_TO_DOMAIN[dto.type],
    amount: dto.amount,
    comment: typeof dto.comment === 'string' ? dto.comment : null,
    createdAt: dto.createdAt,
  }
}

export function fromApiStayDetail(dto: StayDetailDto): StayDetail {
  return {
    ...fromApiStayItem({
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
    }),
    transactions: (dto.transactions ?? []).map(fromApiStayTransaction),
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
