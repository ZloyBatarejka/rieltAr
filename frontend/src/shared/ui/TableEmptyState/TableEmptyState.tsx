import { type ReactElement } from 'react'
import { Text } from '@consta/uikit/Text'
import { Button } from '@consta/uikit/Button'
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
        <Button label={addText} view="primary" onClick={addAction} />
      ) : (
        <Text view="secondary">{emptyText}</Text>
      )}
    </div>
  )
}
