import type { ReactElement } from 'react'
import { Tabs } from '@consta/uikit/Tabs'
import type { OwnerDashboardPeriodTabItem } from '../model/owner-dashboard-period-tabs'

interface OwnerDashboardPeriodTabsProps {
  items: OwnerDashboardPeriodTabItem[]
  value: OwnerDashboardPeriodTabItem
  onChange: (item: OwnerDashboardPeriodTabItem) => void
  className?: string
}

export const OwnerDashboardPeriodTabs: React.FC<OwnerDashboardPeriodTabsProps> = ({
  items,
  value,
  onChange,
  className,
}): ReactElement => {
  return (
    <Tabs
      className={className}
      items={items}
      value={value}
      onChange={onChange}
      getItemLabel={(item) => item.label}
      fitMode="scroll"
    />
  )
}

