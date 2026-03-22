import type { TransactionType } from './transaction'

export interface DashboardTransaction {
  id: string
  type: TransactionType
  amount: number
  comment: string | null
  createdAt: string
}

export interface Dashboard {
  balance: number
  income: number
  expenses: number
  payouts: number
  lastTransactions: DashboardTransaction[]
  propertiesCount: number
  activeStaysCount: number
}
