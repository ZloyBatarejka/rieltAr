import { type ReactElement, type ReactNode } from 'react'
import {
  Table,
  TableContainer,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
} from '@chakra-ui/react'

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
    return <Text>{emptyText}</Text>
  }

  return (
    <TableContainer>
      <Table size="sm">
        <Thead>
          <Tr>
            {columns.map((col, i) => (
              <Th key={i} minW={col.minW} isNumeric={col.isNumeric}>
                {col.header}
              </Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {items.map((item) => (
            <Tr
              key={rowKey(item)}
              onClick={onRowClick ? () => onRowClick(item) : undefined}
              cursor={onRowClick ? 'pointer' : undefined}
              _hover={onRowClick ? { bg: 'blackAlpha.50' } : undefined}
            >
              {columns.map((col, i) => (
                <Td
                  key={i}
                  isNumeric={col.isNumeric}
                  color={col.cellColor?.(item)}
                >
                  {col.render(item)}
                </Td>
              ))}
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  )
}
