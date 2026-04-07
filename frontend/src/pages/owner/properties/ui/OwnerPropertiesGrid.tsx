import type { ReactElement } from 'react'
import { Button } from '@consta/uikit/Button'
import { Card } from '@consta/uikit/Card'
import { Text } from '@consta/uikit/Text'
import type { Property } from '@/shared/types'
import styles from './OwnerPropertiesGrid.module.css'

interface OwnerPropertiesGridProps {
  properties: Property[]
  staysCountFor: (propertyId: string) => number
  onOpenStays: (propertyId: string) => void
}

export const OwnerPropertiesGrid: React.FC<OwnerPropertiesGridProps> = ({
  properties,
  staysCountFor,
  onOpenStays,
}): ReactElement => {
  return (
    <div className={styles.grid}>
      {properties.map((p) => (
        <Card
          key={p.id}
          verticalSpace="l"
          horizontalSpace="xl"
          className={styles.card}
        >
          <Text size="l" weight="bold" view="primary" className={styles.title}>
            {p.title}
          </Text>
          <Text size="s" view="secondary" className={styles.address}>
            {p.address}
          </Text>
          <Text size="s" view="primary" className={styles.staysLine}>
            Заездов: {staysCountFor(p.id)}
          </Text>
          <Button
            size="s"
            view="secondary"
            label="Заезды объекта"
            className={styles.action}
            onClick={() => {
              onOpenStays(p.id)
            }}
          />
        </Card>
      ))}
    </div>
  )
}
