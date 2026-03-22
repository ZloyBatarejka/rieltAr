import { type ReactElement } from 'react'
import { DataTable } from '@/shared/ui/DataTable'
import { staysColumns } from '../model/columns'
import type { StaysTabProps } from '../model/types'

export function StaysTab({ stays }: StaysTabProps): ReactElement {
  return (
    <DataTable
      items={stays}
      columns={staysColumns}
      emptyText="Нет заездов"
      rowKey={(s) => s.id}
    />
  )
}
