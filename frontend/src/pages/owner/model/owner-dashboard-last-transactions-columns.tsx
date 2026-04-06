import { Text } from '@consta/uikit/Text'
import type { DataTableColumn } from '@/shared/ui/DataTable'
import type { DashboardTransaction } from '@/shared/types'
import {
  formatDate,
  formatSignedAmount,
  txAmountColor,
  typeColors,
  typeLabels,
} from '@/pages/manager/owner-detail/lib'
import { StyledBadge } from '@/shared/ui/StyledBadge'
import styles from '../ui/OwnerDashboardLastTransactions.module.css'

export const ownerDashboardLastTransactionsColumns: DataTableColumn<DashboardTransaction>[] = [
  {
    header: 'Дата',
    minW: '120px',
    render: (tx) => (
      <Text size="s" view="primary">
        {formatDate(tx.createdAt)}
      </Text>
    ),
  },
  {
    header: 'Тип',
    minW: '100px',
    render: (tx) => (
      <StyledBadge status={typeColors[tx.type]} label={typeLabels[tx.type]} size="s" />
    ),
  },
  {
    header: 'Сумма',
    minW: '130px',
    isNumeric: true,
    render: (tx) => formatSignedAmount(tx.type, tx.amount),
    cellColor: (tx) => txAmountColor(tx.type),
  },
  {
    header: 'Комментарий',
    minW: '180px',
    render: (tx) => (
      <Text size="s" view="secondary" className={styles.commentText}>
        {tx.comment !== null && tx.comment !== '' ? tx.comment : '—'}
      </Text>
    ),
  },
]
