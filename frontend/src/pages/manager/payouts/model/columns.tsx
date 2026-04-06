import type { DataTableColumn } from '@/shared/ui/DataTable'
import type { Payout } from '@/shared/types'
import { formatCurrency, formatDate } from '@/pages/manager/owner-detail/lib'

export const managerPayoutsColumns: DataTableColumn<Payout>[] = [
  {
    header: 'Дата выплаты',
    minW: '120px',
    render: (p) => formatDate(p.paidAt),
  },
  { header: 'Собственник', minW: '160px', render: (p) => p.ownerName },
  { header: 'Объект', minW: '200px', render: (p) => p.propertyTitle },
  { header: 'Комментарий', minW: '180px', render: (p) => p.comment ?? '—' },
  {
    header: 'Сумма',
    minW: '130px',
    isNumeric: true,
    render: (p) => formatCurrency(p.amount),
  },
]
