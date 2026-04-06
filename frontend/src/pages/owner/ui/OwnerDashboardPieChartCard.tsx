import type { ReactElement } from 'react'
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { Card } from '@consta/uikit/Card'
import { Text } from '@consta/uikit/Text'
import {
  ownerDashboardChartTooltipMoney,
  type OwnerDashboardFlowSlice,
} from '../lib/owner-dashboard-charts'
import styles from './OwnerDashboardCharts.module.css'

interface OwnerDashboardPieChartCardProps {
  data: OwnerDashboardFlowSlice[]
}

export const OwnerDashboardPieChartCard: React.FC<OwnerDashboardPieChartCardProps> = ({
  data,
}): ReactElement => {
  return (
    <Card verticalSpace="l" horizontalSpace="xl" className={styles.chartCard}>
      <Text size="m" weight="semibold" view="primary" className={styles.chartTitle}>
        Структура потоков
      </Text>
      <div className={styles.chartBox}>
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={56}
              outerRadius={96}
              paddingAngle={2}
            >
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.fill} stroke="transparent" />
              ))}
            </Pie>
            <Tooltip formatter={(value: unknown) => ownerDashboardChartTooltipMoney(value)} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}
