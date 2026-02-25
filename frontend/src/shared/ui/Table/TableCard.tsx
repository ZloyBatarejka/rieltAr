import type { ReactElement, ReactNode } from 'react'
import {
  Card,
  CardBody,
  CardHeader,
  Heading,
  IconButton,
} from '@chakra-ui/react'
import { AddIcon } from '@chakra-ui/icons'
import { type Table } from '@tanstack/react-table'
import { Show } from '@/shared/ui/Show'
import { TableList } from './TableList'
import { useTableContext } from './TableContext'
import styles from './TableCard.module.css'

interface TableCardProps<TData> {
  title: string
  table: Table<TData>
  onAddClick: () => void
  size?: 'sm' | 'md' | 'lg'
  footer?: ReactNode
}

export function TableCard<TData>({
  title,
  table,
  onAddClick,
  size = 'sm',
  footer,
}: TableCardProps<TData>): ReactElement | null {
  const { hasData, isLoading, loadingFallback } = useTableContext()
  if (!hasData) return null
  return (
    <Card>
      <CardHeader className={styles.cardHeader}>
        <Heading size="md">{title}</Heading>
        <IconButton
          aria-label="Добавить"
          icon={<AddIcon />}
          colorScheme="blue"
          size="sm"
          onClick={onAddClick}
        />
      </CardHeader>
      <CardBody>
        <Show when={!isLoading} fallback={loadingFallback}>
          <TableList table={table} size={size} />
          {footer}
        </Show>
      </CardBody>
    </Card>
  )
}
