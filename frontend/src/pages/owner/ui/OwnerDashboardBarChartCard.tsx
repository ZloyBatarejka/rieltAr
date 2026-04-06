import type { ReactElement } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Card } from '@consta/uikit/Card'
import { Text } from '@consta/uikit/Text'
import {
  OWNER_DASHBOARD_BAR_CHART_AXIS_TICK,
  OWNER_DASHBOARD_BAR_CHART_GRID,
  OWNER_DASHBOARD_BAR_CHART_HEIGHT,
  OWNER_DASHBOARD_BAR_CHART_MARGIN,
  OWNER_DASHBOARD_BAR_MAX_SIZE,
  OWNER_DASHBOARD_BAR_RADIUS,
  formatOwnerDashboardBarChartYAxisTick,
} from '../lib/owner-dashboard-bar-chart'
import { ownerDashboardChartTooltipMoney, type OwnerDashboardBarRow } from '../lib/owner-dashboard-charts'
import styles from './OwnerDashboardCharts.module.css'

interface OwnerDashboardBarChartCardProps {
  data: OwnerDashboardBarRow[]
}

export const OwnerDashboardBarChartCard: React.FC<OwnerDashboardBarChartCardProps> = ({
  data,
}): ReactElement => {
  return (
    <Card verticalSpace="l" horizontalSpace="xl" className={styles.chartCard}>
      <Text size="m" weight="semibold" view="primary" className={styles.chartTitle}>
        Сравнение сумм
      </Text>
      <div className={styles.chartBox}>
        <ResponsiveContainer width="100%" height={OWNER_DASHBOARD_BAR_CHART_HEIGHT}>
          <BarChart data={data} margin={OWNER_DASHBOARD_BAR_CHART_MARGIN}>
            <CartesianGrid {...OWNER_DASHBOARD_BAR_CHART_GRID} />
            <XAxis dataKey="name" tick={OWNER_DASHBOARD_BAR_CHART_AXIS_TICK} />
            <YAxis
              tickFormatter={formatOwnerDashboardBarChartYAxisTick}
              tick={OWNER_DASHBOARD_BAR_CHART_AXIS_TICK}
            />
            <Tooltip formatter={ownerDashboardChartTooltipMoney} />
            <Bar dataKey="value" radius={OWNER_DASHBOARD_BAR_RADIUS} maxBarSize={OWNER_DASHBOARD_BAR_MAX_SIZE}>
              {data.map((row) => (
                <Cell key={row.name} fill={row.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}
