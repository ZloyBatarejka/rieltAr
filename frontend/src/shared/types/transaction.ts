export type TransactionType =
  | 'INCOME'
  | 'COMMISSION'
  | 'CLEANING'
  | 'EXPENSE'
  | 'PAYOUT'

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
