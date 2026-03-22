import { createColumnHelper, type CoreOptions } from '@tanstack/react-table'
import type { Owner } from '@/shared/types'

const columnHelper = createColumnHelper<Owner>()

export function createOwnersColumns(): CoreOptions<Owner>['columns'] {
  return [
    columnHelper.accessor('name', {
      header: 'Имя',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('phone', {
      header: 'Телефон',
      cell: (info) => {
        const val = info.getValue()
        return val != null ? String(val) : '—'
      },
    }),
    columnHelper.accessor('propertiesCount', {
      header: 'Объектов',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('balance', {
      header: 'Баланс',
      cell: (info) => `${info.getValue()} ₽`,
    }),
  ]
}
