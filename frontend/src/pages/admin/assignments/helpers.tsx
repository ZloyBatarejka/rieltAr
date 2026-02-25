import { createColumnHelper, type CoreOptions } from '@tanstack/react-table'
import type { Assignment } from '@/shared/types'
import { UnassignCell } from './ui/UnassignCell'

const columnHelper = createColumnHelper<Assignment>()

interface CreateAssignmentsColumnsParams {
  onUnassign: (id: string, propertyTitle: string) => Promise<void>
}

export function createAssignmentsColumns(
  params: CreateAssignmentsColumnsParams,
): CoreOptions<Assignment>['columns'] {
  const { onUnassign } = params
  return [
    columnHelper.accessor('userName', {
      header: 'Менеджер',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('propertyTitle', {
      header: 'Объект',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('propertyAddress', {
      header: 'Адрес',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('assignedAt', {
      header: 'Дата назначения',
      cell: (info) => {
        const val = info.getValue()
        return val ? new Date(val).toLocaleDateString('ru-RU') : '—'
      },
    }),
    columnHelper.display({
      id: 'actions',
      header: '',
      cell: (props) => (
        <UnassignCell row={props.row} onUnassign={onUnassign} />
      ),
    }),
  ]
}
