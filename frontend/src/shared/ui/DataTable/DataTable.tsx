import { type ReactElement, type ReactNode } from 'react'
import { Text } from '@consta/uikit/Text'
import styles from './DataTable.module.css'

export interface DataTableColumn<T> {
  header: string
  minW?: string
  isNumeric?: boolean
  render: (item: T) => ReactNode
  cellColor?: (item: T) => string | undefined
}

interface DataTableProps<T> {
  items: T[]
  columns: DataTableColumn<T>[]
  emptyText: string
  rowKey: (item: T) => string
  onRowClick?: (item: T) => void
}

export function DataTable<T>({
  items,
  columns,
  emptyText,
  rowKey,
  onRowClick,
}: DataTableProps<T>): ReactElement {
  if (items.length === 0) {
    return <Text view="secondary" className={styles.emptyText}>{emptyText}</Text>
  }

  return (
    <div className={styles.scrollArea}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((col, i) => (
              <th
                key={i}
                className={col.isNumeric ? styles.numericCell : undefined}
                style={col.minW ? { minWidth: col.minW } : undefined}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr
              key={rowKey(item)}
              className={onRowClick ? styles.clickableRow : undefined}
              onClick={onRowClick ? () => onRowClick(item) : undefined}
            >
              {columns.map((col, i) => (
                <td
                  key={i}
                  className={col.isNumeric ? styles.numericCell : undefined}
                  style={col.cellColor?.(item) ? { color: col.cellColor(item) } : undefined}
                >
                  {col.render(item)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
