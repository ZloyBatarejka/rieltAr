import type { ReactElement, ReactNode } from 'react'
import { Button } from '@consta/uikit/Button'
import { IconAdd } from '@consta/icons/IconAdd'
import { type Table } from '@tanstack/react-table'
import { Show } from '@/shared/ui/Show'
import { TableList } from './TableList'
import { useTableContext } from './TableContext'
import styles from './TableCard.module.css'

interface TableCardProps<TData> {
  title: string
  table: Table<TData>
  onAddClick?: () => void
  onRowClick?: (row: TData) => void
  size?: 'sm' | 'md' | 'lg'
  footer?: ReactNode
  children?: ReactNode
}

export function TableCard<TData>({
  title,
  table,
  onAddClick,
  onRowClick,
  size = 'sm',
  footer,
  children,
}: TableCardProps<TData>): ReactElement | null {
  const { hasData, isLoading, loadingFallback } = useTableContext()
  if (!hasData) return null
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h3 className={styles.title}>{title}</h3>
        {onAddClick ? (
          <Button
            label="Добавить"
            view="primary"
            size="s"
            iconLeft={IconAdd}
            onlyIcon
            onClick={onAddClick}
          />
        ) : null}
      </div>
      <div className={styles.cardBody}>
        {children}
        <Show when={!isLoading} fallback={loadingFallback}>
          <TableList table={table} size={size} onRowClick={onRowClick} />
          {footer}
        </Show>
      </div>
    </div>
  )
}
