import { type ReactElement } from 'react'
import {
  Table as ChakraTable,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react'
import { flexRender, type Table } from '@tanstack/react-table'
import styles from './TableList.module.css'

interface TableListProps<TData> {
  table: Table<TData>
  size?: 'sm' | 'md' | 'lg'
}

export function TableList<TData>({
  table,
  size = 'sm',
}: TableListProps<TData>): ReactElement {
  return (
    <TableContainer className={styles.tableWrap}>
      <ChakraTable size={size}>
        <Thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <Tr key={headerGroup.id} className={styles.tableRow}>
              {headerGroup.headers.map((header) => (
                <Th key={header.id} textTransform="none">
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )}
                </Th>
              ))}
            </Tr>
          ))}
        </Thead>
        <Tbody>
          {table.getRowModel().rows.map((row) => (
            <Tr key={row.id} className={styles.tableRow}>
              {row.getVisibleCells().map((cell) => (
                <Td key={cell.id} className={styles.tableCell}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </Td>
              ))}
            </Tr>
          ))}
        </Tbody>
      </ChakraTable>
    </TableContainer>
  )
}
