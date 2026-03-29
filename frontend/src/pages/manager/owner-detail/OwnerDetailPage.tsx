import { type ReactElement, useState } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { Loader } from '@consta/uikit/Loader'
import { Tabs } from '@consta/uikit/Tabs'
import { Show } from '@/shared/ui/Show'
import { useOwnerDetail } from './model/useOwnerDetail'
import { OwnerHeader } from './ui/OwnerHeader'
import { OverviewTab } from './ui/OverviewTab'
import { PropertiesTab } from './ui/PropertiesTab'
import { StaysTab } from './ui/StaysTab'
import { TransactionsTab } from './ui/TransactionsTab'
import { PayoutsTab } from './ui/PayoutsTab'
import styles from './OwnerDetailPage.module.css'

interface TabItem {
  label: string
  id: string
}

const tabItems: TabItem[] = [
  { label: 'Обзор', id: 'overview' },
  { label: 'Объекты', id: 'properties' },
  { label: 'Заезды', id: 'stays' },
  { label: 'Операции', id: 'transactions' },
  { label: 'Выплаты', id: 'payouts' },
]

export function OwnerDetailPage(): ReactElement {
  const { id } = useParams<{ id: string }>()

  if (!id) {
    return <Navigate to="/manager/owners" replace />
  }

  return <OwnerDetailContent ownerId={id} />
}

function OwnerDetailContent({ ownerId }: { ownerId: string }): ReactElement {
  const {
    owner,
    dashboard,
    properties,
    stays,
    transactions,
    payouts,
    isLoading,
  } = useOwnerDetail(ownerId)

  const [activeTab, setActiveTab] = useState<TabItem>(tabItems[0])

  if (isLoading) {
    return (
      <div className={styles.loaderWrap}>
        <Loader size="m" />
      </div>
    )
  }

  if (!owner || !dashboard) {
    return <Navigate to="/manager/owners" replace />
  }

  return (
    <div>
      <OwnerHeader owner={owner} />
      <Tabs
        items={tabItems}
        value={activeTab}
        onChange={(value) => setActiveTab(value)}
        getItemLabel={(item) => item.label}
        fitMode="scroll"
        className={styles.tabs}
      />
      <div className={styles.tabContent}>
        <Show when={activeTab.id === 'overview'}>
          <OverviewTab dashboard={dashboard} />
        </Show>
        <Show when={activeTab.id === 'properties'}>
          <div className={styles.tabTableCard}>
            <PropertiesTab properties={properties} />
          </div>
        </Show>
        <Show when={activeTab.id === 'stays'}>
          <div className={styles.tabTableCard}>
            <StaysTab stays={stays} />
          </div>
        </Show>
        <Show when={activeTab.id === 'transactions'}>
          <div className={styles.tabTableCard}>
            <TransactionsTab transactions={transactions} />
          </div>
        </Show>
        <Show when={activeTab.id === 'payouts'}>
          <div className={styles.tabTableCard}>
            <PayoutsTab payouts={payouts} />
          </div>
        </Show>
      </div>
    </div>
  )
}
