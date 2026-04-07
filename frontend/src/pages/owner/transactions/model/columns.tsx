import { Badge } from '@consta/uikit/Badge'
import type { DataTableColumn } from '@/shared/ui/DataTable'
import type { Transaction, TransactionType } from '@/shared/types'
import { formatDate, formatSignedAmount, typeLabels } from '@/pages/manager/owner-detail/lib'
import styles from './columns.module.css'

function typeBadgeStatus(
  type: TransactionType,
): 'success' | 'error' | 'normal' | 'warning' {
  if (type === 'INCOME') return 'success'
  if (type === 'PAYOUT') return 'normal'
  return 'error'
}

function txAmountColor(type: TransactionType): string {
  if (type === 'INCOME') return 'var(--color-typo-success)'
  if (type === 'PAYOUT') return 'var(--color-typo-link)'
  return 'var(--color-typo-alert)'
}

export const ownerTransactionsColumns: DataTableColumn<Transaction>[] = [
  { header: 'Дата', minW: '120px', render: (tx) => formatDate(tx.createdAt) },
  {
    header: 'Тип',
    minW: '110px',
    render: (tx) => (
      <Badge
        status={typeBadgeStatus(tx.type)}
        label={typeLabels[tx.type]}
        size="s"
        className={styles.typeBadge}
      />
    ),
  },
  { header: 'Объект', minW: '220px', render: (tx) => tx.propertyTitle },
  {
    header: 'Сумма',
    minW: '140px',
    isNumeric: true,
    render: (tx) => formatSignedAmount(tx.type, tx.amount),
    cellColor: (tx) => txAmountColor(tx.type),
  },
  { header: 'Комментарий', minW: '220px', render: (tx) => tx.comment ?? '—' },
]

