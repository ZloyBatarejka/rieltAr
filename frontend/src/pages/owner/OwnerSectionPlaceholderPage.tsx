import type { ReactElement } from 'react'
import { Card } from '@consta/uikit/Card'
import { Text } from '@consta/uikit/Text'
import styles from './OwnerSectionPlaceholderPage.module.css'

interface OwnerSectionPlaceholderPageProps {
  title: string
  hint?: string
}

export const OwnerSectionPlaceholderPage: React.FC<OwnerSectionPlaceholderPageProps> = ({
  title,
  hint,
}): ReactElement => {
  return (
    <Card verticalSpace="2xl" horizontalSpace="2xl" className={styles.wrap}>
      <Text size="xl" weight="bold" as="h1" view="primary" className={styles.heading}>
        {title}
      </Text>
      {hint !== undefined ? (
        <Text view="secondary" size="m">
          {hint}
        </Text>
      ) : (
        <Text view="secondary" size="m">
          Раздел будет доступен в следующей итерации.
        </Text>
      )}
    </Card>
  )
}
