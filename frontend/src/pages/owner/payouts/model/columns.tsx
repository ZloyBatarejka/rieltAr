import type { DataTableColumn } from '@/shared/ui/DataTable'
import type { Payout } from '@/shared/types'
import { formatCurrency, formatDate } from '@/pages/manager/owner-detail/lib'

export const ownerPayoutsColumns: DataTableColumn<Payout>[] = [
  { header: 'Дата', minW: '120px', render: (p) => formatDate(p.paidAt) },
  { header: 'Объект', minW: '220px', render: (p) => p.propertyTitle },
  { header: 'Комментарий', minW: '220px', render: (p) => p.comment ?? '—' },
  {
    header: 'Сумма',
    minW: '140px',
    isNumeric: true,
    render: (p) => formatCurrency(p.amount),
  },
]

