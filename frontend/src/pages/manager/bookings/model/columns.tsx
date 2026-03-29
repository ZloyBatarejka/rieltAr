import type { DataTableColumn } from '@/shared/ui/DataTable'
import type { Stay } from '@/shared/types'

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('ru-RU')
}

export const staysColumns: DataTableColumn<Stay>[] = [
  { header: 'Гость', minW: '180px', render: (s) => s.guestName },
  { header: 'Объект', minW: '200px', render: (s) => s.propertyTitle },
  { header: 'Заезд', minW: '120px', render: (s) => formatDate(s.checkIn) },
  { header: 'Выезд', minW: '120px', render: (s) => formatDate(s.checkOut) },
  {
    header: 'Сумма',
    minW: '130px',
    isNumeric: true,
    render: (s) => `${s.totalAmount.toLocaleString('ru-RU')} ₽`,
  },
]
