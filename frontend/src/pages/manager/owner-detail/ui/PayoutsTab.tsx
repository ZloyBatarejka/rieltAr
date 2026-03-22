import { type ReactElement } from 'react'
import { DataTable } from '@/shared/ui/DataTable'
import { payoutsColumns } from '../model/columns'
import type { PayoutsTabProps } from '../model/types'

export function PayoutsTab({ payouts }: PayoutsTabProps): ReactElement {
  return (
    <DataTable
      items={payouts}
      columns={payoutsColumns}
      emptyText="Нет выплат"
      rowKey={(p) => p.id}
    />
  )
}
