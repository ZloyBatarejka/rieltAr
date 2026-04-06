import type {
  DashboardResponseDto,
  DashboardTransactionDto,
  DashboardTransactionDtoTypeEnum,
} from '../generated/Api'
import {
  TRANSACTION_TYPE_CLEANING,
  TRANSACTION_TYPE_COMMISSION,
  TRANSACTION_TYPE_EXPENSE,
  TRANSACTION_TYPE_INCOME,
  TRANSACTION_TYPE_PAYOUT,
  type Dashboard,
  type DashboardTransaction,
  type TransactionType,
} from '@/shared/types'

const DASHBOARD_TRANSACTION_DTO_TO_DOMAIN: Record<
  DashboardTransactionDtoTypeEnum,
  TransactionType
> = {
  INCOME: TRANSACTION_TYPE_INCOME,
  COMMISSION: TRANSACTION_TYPE_COMMISSION,
  CLEANING: TRANSACTION_TYPE_CLEANING,
  EXPENSE: TRANSACTION_TYPE_EXPENSE,
  PAYOUT: TRANSACTION_TYPE_PAYOUT,
}

function fromApiDashboardTransaction(
  dto: DashboardTransactionDto,
): DashboardTransaction {
  return {
    id: dto.id,
    type: DASHBOARD_TRANSACTION_DTO_TO_DOMAIN[dto.type],
    amount: dto.amount,
    comment: typeof dto.comment === 'string' ? dto.comment : null,
    createdAt: dto.createdAt,
  }
}

export function fromApiDashboard(dto: DashboardResponseDto): Dashboard {
  return {
    balance: dto.balance,
    income: dto.income,
    expenses: dto.expenses,
    payouts: dto.payouts,
    lastTransactions: dto.lastTransactions.map(fromApiDashboardTransaction),
    propertiesCount: dto.propertiesCount,
    activeStaysCount: dto.activeStaysCount,
  }
}
