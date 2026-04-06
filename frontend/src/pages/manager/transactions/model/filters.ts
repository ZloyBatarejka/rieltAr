import { TRANSACTION_TYPES, type TransactionType } from '@/shared/types'
import { typeLabels } from '@/pages/manager/owner-detail/lib'

/** Пункт селекта «Собственник» / «Объект». */
export interface OwnerPropertySelectItem {
  id: string
  label: string
}

/** Пункт селекта фильтра по типу операции. */
export interface TypeSelectItem {
  id: TransactionType
  label: string
}

export const TYPE_FILTER_ITEMS: TypeSelectItem[] = TRANSACTION_TYPES.map((id) => ({
  id,
  label: typeLabels[id],
}))
