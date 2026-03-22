import type { TransactionType } from '@/shared/types'

export const typeLabels: Record<TransactionType, string> = {
  INCOME: 'Доход',
  COMMISSION: 'Комиссия',
  CLEANING: 'Уборка',
  EXPENSE: 'Расход',
  PAYOUT: 'Выплата',
}

export const typeColors: Record<TransactionType, string> = {
  INCOME: 'green',
  COMMISSION: 'orange',
  CLEANING: 'orange',
  EXPENSE: 'red',
  PAYOUT: 'blue',
}

export function txAmountColor(type: TransactionType): string {
  return type === 'INCOME' ? 'green.500' : 'red.500'
}
