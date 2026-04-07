import { type ReactElement, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { Card } from '@consta/uikit/Card'
import { Loader } from '@consta/uikit/Loader'
import { Text } from '@consta/uikit/Text'
import { DataTable } from '@/shared/ui/DataTable'
import { Show } from '@/shared/ui/Show'
import { RecordsFilters } from '@/features/records-filters'
import { ownerTransactionsStore } from './model/owner-transactions.store'
import { ownerTransactionsColumns } from './model/columns'
import { OWNER_TYPE_FILTER_ITEMS, type SelectItem } from './model/filters'
import styles from './OwnerTransactionsPage.module.css'

function isOwnerTransactionType(value: string): value is (typeof OWNER_TYPE_FILTER_ITEMS)[number]['id'] {
  return OWNER_TYPE_FILTER_ITEMS.some((i) => i.id === value)
}

export const OwnerTransactionsPage = observer(function OwnerTransactionsPage(): ReactElement {
  useEffect(() => {
    void ownerTransactionsStore.fetchDictionaries()
    void ownerTransactionsStore.fetchTransactions()
  }, [])

  const propertyFilterItems: SelectItem[] = ownerTransactionsStore.properties.map((p) => ({
    id: p.id,
    label: p.title,
  }))

  const propertyId = ownerTransactionsStore.filterPropertyId
  const typeFilter = ownerTransactionsStore.filterType

  return (
    <Card verticalSpace="2xl" horizontalSpace="2xl" className={styles.tableCard}>
      <div className={styles.titleRow}>
        <Text size="xl" weight="bold" as="h1" view="primary" className={styles.heading}>
          Операции
        </Text>
      </div>

      <RecordsFilters
        propertyItems={propertyFilterItems}
        propertyId={propertyId}
        onPropertyChange={(id) => ownerTransactionsStore.setFilterPropertyId(id)}
        typeItems={OWNER_TYPE_FILTER_ITEMS}
        typeId={typeFilter}
        onTypeChange={(t) =>
          ownerTransactionsStore.setFilterType(t !== null && isOwnerTransactionType(t) ? t : null)
        }
        from={ownerTransactionsStore.periodFrom}
        to={ownerTransactionsStore.periodTo}
        onFromChange={(d) => ownerTransactionsStore.setPeriodFrom(d)}
        onToChange={(d) => ownerTransactionsStore.setPeriodTo(d)}
        onReset={() => void ownerTransactionsStore.resetFilters()}
        onApply={() => void ownerTransactionsStore.applyFilters()}
      />

      <Show when={ownerTransactionsStore.error}>
        {(message) => (
          <Text view="alert" size="m">
            {message}
          </Text>
        )}
      </Show>

      <Show
        when={!ownerTransactionsStore.isLoading}
        fallback={
          <div className={styles.loaderWrap}>
            <Loader size="m" />
          </div>
        }
      >
        <DataTable
          items={ownerTransactionsStore.transactions}
          columns={ownerTransactionsColumns}
          emptyText="Нет операций"
          rowKey={(t) => t.id}
        />
      </Show>
    </Card>
  )
})

