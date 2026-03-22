import { type ReactElement } from 'react'
import { DataTable } from '@/shared/ui/DataTable'
import { transactionsColumns } from '../model/columns'
import type { TransactionsTabProps } from '../model/types'

export function TransactionsTab({ transactions }: TransactionsTabProps): ReactElement {
  return (
    <DataTable
      items={transactions}
      columns={transactionsColumns}
      emptyText="Нет операций"
      rowKey={(tx) => tx.id}
    />
  )
}
