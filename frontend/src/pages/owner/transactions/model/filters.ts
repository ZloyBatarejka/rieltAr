import { TRANSACTION_TYPES, type TransactionType } from '@/shared/types'
import { typeLabels } from '@/pages/manager/owner-detail/lib'

export interface SelectItem {
  id: string
  label: string
}

export interface TypeSelectItem {
  id: TransactionType
  label: string
}

export const OWNER_TYPE_FILTER_ITEMS: TypeSelectItem[] = TRANSACTION_TYPES.map((id) => ({
  id,
  label: typeLabels[id],
}))

