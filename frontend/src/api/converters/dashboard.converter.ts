import type {
  DashboardResponseDto,
  DashboardTransactionDto,
  DashboardTransactionDtoTypeEnum,
} from '../generated/Api'
import type { Dashboard, DashboardTransaction, TransactionType } from '@/shared/types'

const TRANSACTION_TYPES: Record<DashboardTransactionDtoTypeEnum, TransactionType> = {
  INCOME: 'INCOME',
  COMMISSION: 'COMMISSION',
  CLEANING: 'CLEANING',
  EXPENSE: 'EXPENSE',
  PAYOUT: 'PAYOUT',
}

function fromApiDashboardTransaction(
  dto: DashboardTransactionDto,
): DashboardTransaction {
  return {
    id: dto.id,
    type: TRANSACTION_TYPES[dto.type],
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
