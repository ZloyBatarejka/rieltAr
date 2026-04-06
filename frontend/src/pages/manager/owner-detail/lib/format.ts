import { TRANSACTION_TYPE_INCOME, type TransactionType } from '@/shared/types'

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('ru-RU')
}

export function formatCurrency(value: number): string {
  return `${(+value.toFixed(0)).toLocaleString('ru-RU')} ₽`
}

export function formatSignedAmount(
  type: TransactionType,
  amount: number,
): string {
  const sign = type === TRANSACTION_TYPE_INCOME ? '+' : '−'
  return `${sign}${formatCurrency(amount)}`
}
