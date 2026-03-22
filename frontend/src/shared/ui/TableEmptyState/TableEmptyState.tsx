import { type ReactElement } from 'react'
import { Button, Text } from '@chakra-ui/react'
import styles from './TableEmptyState.module.css'

interface TableEmptyStateProps {
  addText?: string
  addAction?: () => void
  emptyText?: string
}

export function TableEmptyState({
  addText,
  addAction,
  emptyText = 'Нет данных',
}: TableEmptyStateProps): ReactElement {
  return (
    <div className={styles.wrapper}>
      {addText && addAction ? (
        <Button colorScheme="blue" onClick={addAction}>
          {addText}
        </Button>
      ) : (
        <Text>{emptyText}</Text>
      )}
    </div>
  )
}
