import { type ReactElement } from 'react'
import { Button } from '@chakra-ui/react'
import styles from './TableEmptyState.module.css'

interface TableEmptyStateProps {
  addText: string
  addAction: () => void
}

export function TableEmptyState({
  addText,
  addAction,
}: TableEmptyStateProps): ReactElement {
  return (
    <div className={styles.wrapper}>
      <Button colorScheme="blue" onClick={addAction}>
        {addText}
      </Button>
    </div>
  )
}
