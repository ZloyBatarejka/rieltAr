/** Единый перечень типов операций (порядок — для фильтров и UI). */
export const TRANSACTION_TYPES = [
  'INCOME',
  'COMMISSION',
  'CLEANING',
  'EXPENSE',
  'PAYOUT',
] as const

export type TransactionType = (typeof TRANSACTION_TYPES)[number]

/** Код типа «доход» — первый в `TRANSACTION_TYPES`, дефолт в формах и сравнениях. */
export const TRANSACTION_TYPE_INCOME = TRANSACTION_TYPES[0]

export const TRANSACTION_TYPE_COMMISSION = TRANSACTION_TYPES[1]
export const TRANSACTION_TYPE_CLEANING = TRANSACTION_TYPES[2]
export const TRANSACTION_TYPE_EXPENSE = TRANSACTION_TYPES[3]
export const TRANSACTION_TYPE_PAYOUT = TRANSACTION_TYPES[4]

export interface Transaction {
  id: string
  type: TransactionType
  amount: number
  comment: string | null
  propertyId: string
  propertyTitle: string
  ownerId: string
  ownerName: string
  createdAt: string
}

export interface TransactionsList {
  items: Transaction[]
  total: number
}

export interface CreateTransaction {
  propertyId: string
  type: TransactionType
  amount: number
  comment?: string
}
