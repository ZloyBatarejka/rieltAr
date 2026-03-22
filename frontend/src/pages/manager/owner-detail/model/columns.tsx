import { Badge } from '@chakra-ui/react'
import type { DataTableColumn } from '@/shared/ui/DataTable'
import type { Property, Stay, Transaction, Payout } from '@/shared/types'
import { formatDate, formatCurrency, formatSignedAmount } from '../lib'
import { typeLabels, typeColors, txAmountColor } from '../lib'

export const propertiesColumns: DataTableColumn<Property>[] = [
  { header: 'Название', minW: '160px', render: (p) => p.title },
  { header: 'Адрес', minW: '200px', render: (p) => p.address },
]

export const staysColumns: DataTableColumn<Stay>[] = [
  { header: 'Гость', minW: '140px', render: (s) => s.guestName },
  { header: 'Объект', minW: '160px', render: (s) => s.propertyTitle },
  { header: 'Заезд', minW: '100px', render: (s) => formatDate(s.checkIn) },
  { header: 'Выезд', minW: '100px', render: (s) => formatDate(s.checkOut) },
  {
    header: 'Сумма',
    minW: '100px',
    isNumeric: true,
    render: (s) => formatCurrency(s.totalAmount),
  },
]

export const transactionsColumns: DataTableColumn<Transaction>[] = [
  {
    header: 'Дата',
    minW: '100px',
    render: (tx) => formatDate(tx.createdAt),
  },
  {
    header: 'Тип',
    minW: '100px',
    render: (tx) => (
      <Badge colorScheme={typeColors[tx.type]}>{typeLabels[tx.type]}</Badge>
    ),
  },
  { header: 'Объект', minW: '160px', render: (tx) => tx.propertyTitle },
  { header: 'Комментарий', minW: '140px', render: (tx) => tx.comment ?? '—' },
  {
    header: 'Сумма',
    minW: '100px',
    isNumeric: true,
    render: (tx) => formatSignedAmount(tx.type, tx.amount),
    cellColor: (tx) => txAmountColor(tx.type),
  },
]

export const payoutsColumns: DataTableColumn<Payout>[] = [
  { header: 'Дата', minW: '100px', render: (p) => formatDate(p.paidAt) },
  { header: 'Объект', minW: '160px', render: (p) => p.propertyTitle },
  { header: 'Комментарий', minW: '160px', render: (p) => p.comment ?? '—' },
  {
    header: 'Сумма',
    minW: '100px',
    isNumeric: true,
    render: (p) => formatCurrency(p.amount),
  },
]
