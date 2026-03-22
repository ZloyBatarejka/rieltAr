import { type ReactElement } from 'react'
import { useTableContext } from './TableContext'
import { TableEmptyState } from '@/shared/ui/TableEmptyState'

interface TableEmptyFallbackProps {
  addText?: string
  addAction?: () => void
  emptyText?: string
}

export function TableEmptyFallback({
  addText,
  addAction,
  emptyText,
}: TableEmptyFallbackProps): ReactElement | null {
  const { hasData } = useTableContext()
  if (hasData) return null
  return (
    <TableEmptyState
      addText={addText}
      addAction={addAction}
      emptyText={emptyText}
    />
  )
}
