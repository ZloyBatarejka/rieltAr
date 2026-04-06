import { TRANSACTION_TYPE_INCOME, type TransactionType } from '@/shared/types'

export const typeLabels: Record<TransactionType, string> = {
  INCOME: 'Доход',
  COMMISSION: 'Комиссия',
  CLEANING: 'Уборка',
  EXPENSE: 'Расход',
  PAYOUT: 'Выплата',
}

export const typeColors: Record<TransactionType, 'success' | 'warning' | 'error' | 'normal'> = {
  INCOME: 'success',
  COMMISSION: 'warning',
  CLEANING: 'warning',
  EXPENSE: 'error',
  PAYOUT: 'normal',
}

export function txAmountColor(type: TransactionType): string {
  return type === TRANSACTION_TYPE_INCOME
    ? 'var(--color-typo-success)'
    : 'var(--color-typo-alert)'
}
