import { createColumnHelper, type CoreOptions } from '@tanstack/react-table'

import type { Manager } from '@/shared/types'
import { RemoveManagerCell } from './ui/RemoveManagerCell'
import { PermissionSwitch } from './ui/PermissionSwitch'
import type { CreateManagersColumnsParams } from './model/types'

const columnHelper = createColumnHelper<Manager>()

export function createManagersColumns(
  params: CreateManagersColumnsParams,
): CoreOptions<Manager>['columns'] {
  const { onDeleteManager, onPermissionChange } = params
  return [
    columnHelper.accessor('email', {
      header: 'Email',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('name', {
      header: 'Имя',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('canCreateOwners', {
      header: 'Создаёт собственников',
      cell: (info) => (
        <PermissionSwitch
          value={info.getValue()}
          onChange={(checked) => {
            onPermissionChange(info.row.original.id, 'canCreateOwners', checked)
          }}
        />
      ),
    }),
    columnHelper.accessor('canCreateProperties', {
      header: 'Создаёт объекты',
      cell: (info) => (
        <PermissionSwitch
          value={info.getValue()}
          onChange={(checked) => {
            onPermissionChange(
              info.row.original.id,
              'canCreateProperties',
              checked,
            )
          }}
        />
      ),
    }),
    columnHelper.display({
      id: 'actions',
      header: '',
      cell: (props) => (
        <RemoveManagerCell row={props.row} onDelete={onDeleteManager} />
      ),
    }),
  ]
}
