import { Badge } from '@consta/uikit/Badge'
import type { DataTableColumn } from '@/shared/ui/DataTable'
import type { Transaction } from '@/shared/types'
import {
  formatDate,
  formatSignedAmount,
  typeLabels,
  typeColors,
  txAmountColor,
} from '@/pages/manager/owner-detail/lib'

export const managerTransactionsColumns: DataTableColumn<Transaction>[] = [
  {
    header: 'Дата',
    minW: '120px',
    render: (tx) => formatDate(tx.createdAt),
  },
  {
    header: 'Тип',
    minW: '100px',
    render: (tx) => (
      <Badge
        status={typeColors[tx.type]}
        label={typeLabels[tx.type]}
        style={{
          width: '100px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        size="s"
      />
    ),
  },
  { header: 'Объект', minW: '200px', render: (tx) => tx.propertyTitle },
  { header: 'Собственник', minW: '180px', render: (tx) => tx.ownerName },
  {
    header: 'Сумма',
    minW: '130px',
    isNumeric: true,
    render: (tx) => formatSignedAmount(tx.type, tx.amount),
    cellColor: (tx) => txAmountColor(tx.type),
  },
  { header: 'Комментарий', minW: '180px', render: (tx) => tx.comment ?? '—' },
]
