import { createContext, useContext, type ReactNode } from 'react'

export interface TableContextValue {
  hasData: boolean
  isLoading: boolean
  loadingFallback: ReactNode
}

export const TableContext = createContext<TableContextValue | null>(null)

export function useTableContext(): TableContextValue {
  const ctx = useContext(TableContext)
  if (!ctx) {
    throw new Error('Table compound components must be used within Table')
  }
  return ctx
}
