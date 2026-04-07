import { Text } from '@consta/uikit/Text'
import type { DataTableColumn } from '@/shared/ui/DataTable'
import type { Stay } from '@/shared/types'
import { formatCurrency, formatDate } from '@/pages/manager/owner-detail/lib'

export const ownerStaysListColumns: DataTableColumn<Stay>[] = [
  {
    header: 'Гость',
    minW: '180px',
    render: (s) => (
      <Text size="s" view="primary">
        {s.guestName}
      </Text>
    ),
  },
  {
    header: 'Объект',
    minW: '200px',
    render: (s) => (
      <Text size="s" view="primary">
        {s.propertyTitle}
      </Text>
    ),
  },
  {
    header: 'Заезд',
    minW: '120px',
    render: (s) => (
      <Text size="s" view="primary">
        {formatDate(s.checkIn)}
      </Text>
    ),
  },
  {
    header: 'Выезд',
    minW: '120px',
    render: (s) => (
      <Text size="s" view="primary">
        {formatDate(s.checkOut)}
      </Text>
    ),
  },
  {
    header: 'Сумма',
    minW: '130px',
    isNumeric: true,
    render: (s) => (
      <Text size="s" view="primary">
        {formatCurrency(s.totalAmount)}
      </Text>
    ),
  },
]
