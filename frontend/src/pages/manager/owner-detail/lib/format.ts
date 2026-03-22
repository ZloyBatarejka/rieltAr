import type { TransactionType } from '@/shared/types'

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('ru-RU')
}

export function formatCurrency(value: number): string {
  return `${value.toLocaleString('ru-RU')} ₽`
}

export function formatSignedAmount(type: TransactionType, amount: number): string {
  const sign = type === 'INCOME' ? '+' : '−'
  return `${sign}${formatCurrency(amount)}`
}
