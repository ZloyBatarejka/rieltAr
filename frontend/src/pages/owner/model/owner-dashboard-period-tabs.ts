import type { OwnerDashboardPeriod } from './owner-dashboard.store'

export interface OwnerDashboardPeriodTabItem {
  label: string
  id: OwnerDashboardPeriod
}

export const OWNER_DASHBOARD_PERIOD_TABS: OwnerDashboardPeriodTabItem[] = [
  { label: 'Месяц', id: 'month' },
  { label: 'Квартал', id: 'quarter' },
  { label: 'Год', id: 'year' },
  { label: 'Всё время', id: 'all' },
]

export function getActiveOwnerDashboardPeriodTab(
  period: OwnerDashboardPeriod,
): OwnerDashboardPeriodTabItem {
  return (
    OWNER_DASHBOARD_PERIOD_TABS.find((t) => t.id === period) ??
    OWNER_DASHBOARD_PERIOD_TABS[0]
  )
}
