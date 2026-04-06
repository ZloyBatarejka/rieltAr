import { formatCurrency } from '@/pages/manager/owner-detail/lib'

export interface OwnerDashboardFlowSlice {
  name: string
  value: number
  fill: string
}

export interface OwnerDashboardBarRow {
  name: string
  value: number
  fill: string
}

export const OWNER_DASHBOARD_CHART_FILL_INCOME = 'var(--color-bg-success)'
export const OWNER_DASHBOARD_CHART_FILL_EXPENSES = 'var(--color-bg-alert)'
export const OWNER_DASHBOARD_CHART_FILL_PAYOUTS = 'var(--color-bg-normal)'

export function buildOwnerDashboardPieData(
  income: number,
  expenses: number,
  payouts: number,
): OwnerDashboardFlowSlice[] {
  return [
    { name: 'Доход', value: income, fill: OWNER_DASHBOARD_CHART_FILL_INCOME },
    { name: 'Расходы', value: expenses, fill: OWNER_DASHBOARD_CHART_FILL_EXPENSES },
    { name: 'Выплаты', value: payouts, fill: OWNER_DASHBOARD_CHART_FILL_PAYOUTS },
  ]
}

export function buildOwnerDashboardBarData(
  income: number,
  expenses: number,
  payouts: number,
): OwnerDashboardBarRow[] {
  return [
    { name: 'Доход', value: income, fill: OWNER_DASHBOARD_CHART_FILL_INCOME },
    { name: 'Расходы', value: expenses, fill: OWNER_DASHBOARD_CHART_FILL_EXPENSES },
    { name: 'Выплаты', value: payouts, fill: OWNER_DASHBOARD_CHART_FILL_PAYOUTS },
  ]
}

export function ownerDashboardChartTooltipMoney(value: unknown): string {
  if (typeof value === 'number') {
    return formatCurrency(value)
  }
  if (typeof value === 'string') {
    const n = Number(value)
    return Number.isFinite(n) ? formatCurrency(n) : ''
  }
  return ''
}
