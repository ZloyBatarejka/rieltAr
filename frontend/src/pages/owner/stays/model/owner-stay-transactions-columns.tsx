import type { DataTableColumn } from '@/shared/ui/DataTable'
import type { StayTransaction } from '@/shared/types'
import { formatCurrency, typeLabels, txAmountColor } from '@/pages/manager/owner-detail/lib'

export const ownerStayTransactionsColumns: DataTableColumn<StayTransaction>[] = [
  {
    header: 'Тип',
    minW: '120px',
    render: (tx) => typeLabels[tx.type],
  },
  {
    header: 'Сумма',
    minW: '120px',
    isNumeric: true,
    render: (tx) => formatCurrency(tx.amount),
    cellColor: (tx) => txAmountColor(tx.type),
  },
  {
    header: 'Комментарий',
    minW: '200px',
    render: (tx) => (tx.comment !== null && tx.comment !== '' ? tx.comment : '—'),
  },
]
