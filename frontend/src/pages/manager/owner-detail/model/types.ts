import type {
  Dashboard,
  Property,
  Stay,
  Transaction,
  Payout,
} from '@/shared/types'

export interface OverviewTabProps {
  dashboard: Dashboard
}

export interface PropertiesTabProps {
  properties: Property[]
}

export interface StaysTabProps {
  stays: Stay[]
}

export interface TransactionsTabProps {
  transactions: Transaction[]
}

export interface PayoutsTabProps {
  payouts: Payout[]
}
