import type { DataTableColumn } from '@/shared/ui/DataTable'
import type { Owner } from '@/shared/types'

export const ownersColumns: DataTableColumn<Owner>[] = [
  { header: 'Имя', minW: '140px', render: (o) => o.name },
  {
    header: 'Телефон',
    minW: '120px',
    render: (o) => (o.phone != null ? String(o.phone) : '—'),
  },
  { header: 'Объектов', minW: '80px', render: (o) => o.propertiesCount },
  {
    header: 'Баланс',
    minW: '100px',
    isNumeric: true,
    render: (o) => `${o.balance.toLocaleString('ru-RU')} ₽`,
  },
]
