import { type ReactElement } from 'react'
import { DataTable } from '@/shared/ui/DataTable'
import type { DashboardTransaction } from '@/shared/types'
import { ownerDashboardLastTransactionsColumns } from '../model/owner-dashboard-last-transactions-columns'

interface OwnerDashboardLastTransactionsProps {
  transactions: DashboardTransaction[]
}

export const OwnerDashboardLastTransactions: React.FC<OwnerDashboardLastTransactionsProps> = ({
  transactions,
}): ReactElement => {
  return (
    <DataTable
      items={transactions}
      columns={ownerDashboardLastTransactionsColumns}
      emptyText="За период нет операций в ленте."
      rowKey={(tx) => tx.id}
    />
  )
}
