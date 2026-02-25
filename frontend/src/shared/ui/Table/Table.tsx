import { type ReactElement, type ReactNode } from 'react'
import { TableContext } from './TableContext'
import { TableCard } from './TableCard'
import { TableEmptyFallback } from './TableEmptyFallback'
import { TableList } from './TableList'

interface TableProps {
  hasData: boolean
  isLoading: boolean
  loadingFallback?: ReactNode
  children: ReactNode
}

function TableImpl({
  hasData,
  isLoading,
  loadingFallback = <span>Загрузка...</span>,
  children,
}: TableProps): ReactElement {
  const value = {
    hasData,
    isLoading,
    loadingFallback,
  }

  return <TableContext.Provider value={value}>{children}</TableContext.Provider>
}

export const Table = Object.assign(TableImpl, {
  EmptyFallback: TableEmptyFallback,
  Card: TableCard,
  List: TableList,
})
