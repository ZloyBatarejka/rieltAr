import type { ReactElement } from 'react'
import { Card } from '@consta/uikit/Card'
import { Text } from '@consta/uikit/Text'
import styles from './OwnerDashboardCharts.module.css'

export const OwnerDashboardChartsEmpty: React.FC = (): ReactElement => {
  return (
    <Card verticalSpace="l" horizontalSpace="xl" className={styles.emptyCard}>
      <Text view="secondary" size="m">
        Нет операций за выбранный период — нечего отобразить на графиках.
      </Text>
    </Card>
  )
}
