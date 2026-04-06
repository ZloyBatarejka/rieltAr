import { type ReactElement, useMemo } from 'react'
import {
  buildOwnerDashboardBarData,
  buildOwnerDashboardPieData,
} from '../lib/owner-dashboard-charts'
import { OwnerDashboardBarChartCard } from './OwnerDashboardBarChartCard'
import { OwnerDashboardChartsEmpty } from './OwnerDashboardChartsEmpty'
import { OwnerDashboardPieChartCard } from './OwnerDashboardPieChartCard'
import styles from './OwnerDashboardCharts.module.css'

interface OwnerDashboardChartsProps {
  income: number
  expenses: number
  payouts: number
}

export const OwnerDashboardCharts: React.FC<OwnerDashboardChartsProps> = ({
  income,
  expenses,
  payouts,
}): ReactElement => {
  const hasActivity = income + expenses + payouts > 0

  const pieData = useMemo(
    () => buildOwnerDashboardPieData(income, expenses, payouts),
    [income, expenses, payouts],
  )
  const barData = useMemo(
    () => buildOwnerDashboardBarData(income, expenses, payouts),
    [income, expenses, payouts],
  )

  if (!hasActivity) {
    return <OwnerDashboardChartsEmpty />
  }

  return (
    <div className={styles.chartsGrid}>
      <OwnerDashboardPieChartCard data={pieData} />
      <OwnerDashboardBarChartCard data={barData} />
    </div>
  )
}
