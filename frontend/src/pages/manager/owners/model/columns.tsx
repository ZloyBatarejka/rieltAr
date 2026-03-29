import type { DataTableColumn } from '@/shared/ui/DataTable'
import type { Owner } from '@/shared/types'

export const ownersColumns: DataTableColumn<Owner>[] = [
  { header: 'Имя', minW: '180px', render: (o) => o.name },
  {
    header: 'Телефон',
    minW: '160px',
    render: (o) => (o.phone != null ? String(o.phone) : '—'),
  },
  { header: 'Объектов', minW: '100px', render: (o) => o.propertiesCount },
  {
    header: 'Баланс',
    minW: '130px',
    isNumeric: true,
    render: (o) => `${o.balance.toLocaleString('ru-RU')} ₽`,
  },
]
