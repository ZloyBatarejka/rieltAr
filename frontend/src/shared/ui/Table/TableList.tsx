import { type ReactElement } from 'react'
import { flexRender, type Table as TanstackTable } from '@tanstack/react-table'
import styles from './TableList.module.css'

interface TableListProps<TData> {
  table: TanstackTable<TData>
  size?: 'sm' | 'md' | 'lg'
  onRowClick?: (row: TData) => void
}

export function TableList<TData>({
  table,
  onRowClick,
}: TableListProps<TData>): ReactElement {
  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className={styles.tableRow}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              className={`${styles.tableRow} ${onRowClick ? styles.clickableRow : ''}`}
              onClick={onRowClick ? () => onRowClick(row.original) : undefined}
            >
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className={styles.tableCell}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
