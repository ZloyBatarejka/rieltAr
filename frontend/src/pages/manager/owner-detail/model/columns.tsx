import { Badge } from '@consta/uikit/Badge'
import type { DataTableColumn } from '@/shared/ui/DataTable'
import type { Property, Stay, Transaction, Payout } from '@/shared/types'
import { formatDate, formatCurrency, formatSignedAmount } from '../lib'
import { typeLabels, typeColors, txAmountColor } from '../lib'

export const propertiesColumns: DataTableColumn<Property>[] = [
  { header: 'Название', minW: '200px', render: (p) => p.title },
  { header: 'Адрес', minW: '260px', render: (p) => p.address },
]

export const staysColumns: DataTableColumn<Stay>[] = [
  { header: 'Гость', minW: '180px', render: (s) => s.guestName },
  { header: 'Объект', minW: '200px', render: (s) => s.propertyTitle },
  { header: 'Заезд', minW: '120px', render: (s) => formatDate(s.checkIn) },
  { header: 'Выезд', minW: '120px', render: (s) => formatDate(s.checkOut) },
  {
    header: 'Сумма',
    minW: '130px',
    isNumeric: true,
    render: (s) => formatCurrency(s.totalAmount),
  },
]

export const transactionsColumns: DataTableColumn<Transaction>[] = [
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
  { header: 'Комментарий', minW: '180px', render: (tx) => tx.comment ?? '—' },
  {
    header: 'Сумма',
    minW: '130px',
    isNumeric: true,
    render: (tx) => formatSignedAmount(tx.type, tx.amount),
    cellColor: (tx) => txAmountColor(tx.type),
  },
]

export const payoutsColumns: DataTableColumn<Payout>[] = [
  { header: 'Дата', minW: '120px', render: (p) => formatDate(p.paidAt) },
  { header: 'Объект', minW: '200px', render: (p) => p.propertyTitle },
  { header: 'Комментарий', minW: '200px', render: (p) => p.comment ?? '—' },
  {
    header: 'Сумма',
    minW: '130px',
    isNumeric: true,
    render: (p) => formatCurrency(p.amount),
  },
]
