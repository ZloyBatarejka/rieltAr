import { createColumnHelper, type CoreOptions } from '@tanstack/react-table'
import type { Property } from '@/shared/types'
import { PropertyActionsCell } from './ui/PropertyActionsCell'

const columnHelper = createColumnHelper<Property>()

interface CreatePropertiesColumnsParams {
  onEdit: (prop: Property) => void
  onDelete: (id: string, title: string) => Promise<void>
}

export function createPropertiesColumns(
  params: CreatePropertiesColumnsParams,
): CoreOptions<Property>['columns'] {
  const { onEdit, onDelete } = params
  return [
    columnHelper.accessor('title', {
      header: 'Название',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('address', {
      header: 'Адрес',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('ownerName', {
      header: 'Собственник',
      cell: (info) => info.getValue(),
    }),
    columnHelper.display({
      id: 'actions',
      header: '',
      cell: (props) => (
        <PropertyActionsCell
          row={props.row}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ),
    }),
  ]
}
