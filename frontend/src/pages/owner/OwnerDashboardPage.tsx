import { type ReactElement, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { Text } from '@consta/uikit/Text'
import { authStore } from '@/entities/auth'
import { Show } from '@/shared/ui/Show'
import { ownerDashboardStore } from './model/owner-dashboard.store'
import {
  OWNER_DASHBOARD_PERIOD_TABS,
  getActiveOwnerDashboardPeriodTab,
  type OwnerDashboardPeriodTabItem,
} from './model/owner-dashboard-period-tabs'
import { OwnerDashboardHeader } from './ui/OwnerDashboardHeader'
import {
  OwnerDashboardCenteredLoader,
  OwnerDashboardInlineLoader,
} from './ui/OwnerDashboardLoaders'
import { OwnerDashboardPeriodTabs } from './ui/OwnerDashboardPeriodTabs'
import { OwnerDashboardSummary } from './ui/OwnerDashboardSummary'
import styles from './OwnerDashboardPage.module.css'

const OwnerDashboardPage = observer(function OwnerDashboardPage(): ReactElement {
  useEffect(() => {
    void ownerDashboardStore.fetch()
  }, [])

  const { period, dashboard, isLoading, error } = ownerDashboardStore

  const activePeriodTab = getActiveOwnerDashboardPeriodTab(period)

  return (
    <div className={styles.wrapper}>
      <OwnerDashboardHeader
        className={styles.headerRow}
        userName={authStore.user?.name ?? 'Собственник'}
      />

      <OwnerDashboardPeriodTabs
        className={styles.periodTabs}
        items={OWNER_DASHBOARD_PERIOD_TABS}
        value={activePeriodTab}
        onChange={(item: OwnerDashboardPeriodTabItem) => {
          ownerDashboardStore.setPeriod(item.id)
        }}
      />

      <Show when={error}>
        {(value) => (
          <Text view="alert" size="m">
            {value}
          </Text>
        )}
      </Show>

      <Show when={isLoading && dashboard === null}>
        <OwnerDashboardCenteredLoader className={styles.loaderWrap} />
      </Show>

      <Show when={dashboard}>
        {(value) => <OwnerDashboardSummary dashboard={value} />}
      </Show>

      <Show when={isLoading && dashboard !== null}>
        <OwnerDashboardInlineLoader className={styles.inlineLoader} />
      </Show>
    </div>
  )
})

export default OwnerDashboardPage
