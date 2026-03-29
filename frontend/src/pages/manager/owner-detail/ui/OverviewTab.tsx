import { type ReactElement } from 'react'
import { Card } from '@consta/uikit/Card'
import { Text } from '@consta/uikit/Text'
import { Badge } from '@consta/uikit/Badge'
import { Show } from '@/shared/ui/Show'
import type { OverviewTabProps } from '../model/types'
import { formatCurrency, formatSignedAmount, typeLabels, typeColors } from '../lib'
import styles from './OverviewTab.module.css'

type TextViewType = 'primary' | 'secondary' | 'ghost' | 'brand' | 'link' | 'success' | 'warning' | 'alert'

export function OverviewTab({ dashboard }: OverviewTabProps): ReactElement {
  return (
    <div className={styles.wrapper}>
      <div className={styles.statsRow}>
        <StatCard label="Доход" value={dashboard.income} view="success" />
        <StatCard label="Расходы" value={dashboard.expenses} view="alert" />
        <StatCard label="Выплачено" value={dashboard.payouts} view="link" />
        <StatCard label="Объектов" value={dashboard.propertiesCount} />
      </div>

      <Card verticalSpace="2xl" horizontalSpace="2xl" className={styles.card}>
        <Text weight="semibold" view="primary" className={styles.txHeading}>
          Последние операции
        </Text>
        <Show when={dashboard.lastTransactions.length > 0} fallback={<Text view="secondary">Нет операций</Text>}>
          <div className={styles.txList}>
            {dashboard.lastTransactions.map((tx) => (
              <div key={tx.id} className={styles.txRow}>
                <Badge status={typeColors[tx.type]} label={typeLabels[tx.type]} size="s" />
                <Text view="primary" className={styles.txComment}>{tx.comment ?? ''}</Text>
                <Text
                  className={styles.txAmount}
                  view={tx.type === 'INCOME' ? 'success' : 'alert'}
                >
                  {formatSignedAmount(tx.type, tx.amount)}
                </Text>
              </div>
            ))}
          </div>
        </Show>
      </Card>
    </div>
  )
}

function StatCard({
  label,
  value,
  view,
}: {
  label: string
  value: number
  view?: TextViewType
}): ReactElement {
  return (
    <Card className={styles.statCard} verticalSpace="l" horizontalSpace="l">
      <Text size="s" view="secondary">
        {label}
      </Text>
      <Text size="xl" weight="bold" view={view ?? 'primary'}>
        {typeof value === 'number' && label !== 'Объектов'
          ? formatCurrency(value)
          : value}
      </Text>
    </Card>
  )
}
