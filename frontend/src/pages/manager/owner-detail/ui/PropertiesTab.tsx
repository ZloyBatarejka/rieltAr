import { type ReactElement } from 'react'
import { DataTable } from '@/shared/ui/DataTable'
import { propertiesColumns } from '../model/columns'
import type { PropertiesTabProps } from '../model/types'

export function PropertiesTab({ properties }: PropertiesTabProps): ReactElement {
  return (
    <DataTable
      items={properties}
      columns={propertiesColumns}
      emptyText="Нет объектов"
      rowKey={(p) => p.id}
    />
  )
}
