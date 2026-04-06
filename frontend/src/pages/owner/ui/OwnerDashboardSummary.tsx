import type { ReactElement } from 'react'
import { Card } from '@consta/uikit/Card'
import { Text } from '@consta/uikit/Text'
import { formatCurrency } from '@/pages/manager/owner-detail/lib'
import type { Dashboard } from '@/shared/types'
import { OwnerDashboardCharts } from './OwnerDashboardCharts'
import { OwnerDashboardLastTransactions } from './OwnerDashboardLastTransactions'
import styles from './OwnerDashboardSummary.module.css'

interface OwnerDashboardSummaryProps {
  dashboard: Dashboard
}

export const OwnerDashboardSummary: React.FC<OwnerDashboardSummaryProps> = ({
  dashboard,
}): ReactElement => {
  return (
    <>
      <div className={styles.statsRow}>
        <Card verticalSpace="l" horizontalSpace="xl" className={styles.statCard}>
          <Text size="s" view="secondary">
            Баланс
          </Text>
          <Text
            size="2xl"
            weight="bold"
            view={dashboard.balance >= 0 ? 'success' : 'alert'}
            className={styles.statValue}
          >
            {formatCurrency(dashboard.balance)}
          </Text>
        </Card>
        <Card verticalSpace="l" horizontalSpace="xl" className={styles.statCard}>
          <Text size="s" view="secondary">
            Объектов
          </Text>
          <Text size="2xl" weight="bold" view="primary" className={styles.statValue}>
            {dashboard.propertiesCount}
          </Text>
        </Card>
        <Card verticalSpace="l" horizontalSpace="xl" className={styles.statCard}>
          <Text size="s" view="secondary">
            Активных заездов
          </Text>
          <Text size="2xl" weight="bold" view="primary" className={styles.statValue}>
            {dashboard.activeStaysCount}
          </Text>
        </Card>
      </div>

      <OwnerDashboardCharts
        income={dashboard.income}
        expenses={dashboard.expenses}
        payouts={dashboard.payouts}
      />

      <Card verticalSpace="l" horizontalSpace="xl" className={styles.lastTxCard}>
        <Text size="m" weight="semibold" view="primary" className={styles.blockTitle}>
          Последние операции
        </Text>
        <OwnerDashboardLastTransactions transactions={dashboard.lastTransactions} />
      </Card>
    </>
  )
}

