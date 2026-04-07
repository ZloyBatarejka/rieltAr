import { type ReactElement, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { Card } from '@consta/uikit/Card'
import { Loader } from '@consta/uikit/Loader'
import { Text } from '@consta/uikit/Text'
import { DataTable } from '@/shared/ui/DataTable'
import { Show } from '@/shared/ui/Show'
import { RecordsFilters } from '@/features/records-filters'
import { ownerPayoutsStore } from './model/owner-payouts.store'
import { ownerPayoutsColumns } from './model/columns'
import styles from './OwnerPayoutsPage.module.css'

interface SelectItem {
  id: string
  label: string
}

export const OwnerPayoutsPage = observer(function OwnerPayoutsPage(): ReactElement {
  useEffect(() => {
    void ownerPayoutsStore.fetchDictionaries()
    void ownerPayoutsStore.fetchPayouts()
  }, [])

  const propertyFilterItems: SelectItem[] = ownerPayoutsStore.properties.map((p) => ({
    id: p.id,
    label: p.title,
  }))

  const propertyId = ownerPayoutsStore.filterPropertyId

  return (
    <Card verticalSpace="2xl" horizontalSpace="2xl" className={styles.tableCard}>
      <div className={styles.titleRow}>
        <Text size="xl" weight="bold" as="h1" view="primary" className={styles.heading}>
          Выплаты
        </Text>
      </div>

      <RecordsFilters
        propertyItems={propertyFilterItems}
        propertyId={propertyId}
        onPropertyChange={(id) => ownerPayoutsStore.setFilterPropertyId(id)}
        from={ownerPayoutsStore.periodFrom}
        to={ownerPayoutsStore.periodTo}
        onFromChange={(d) => ownerPayoutsStore.setPeriodFrom(d)}
        onToChange={(d) => ownerPayoutsStore.setPeriodTo(d)}
        onReset={() => void ownerPayoutsStore.resetFilters()}
        onApply={() => void ownerPayoutsStore.applyFilters()}
      />

      <Show when={ownerPayoutsStore.error}>
        {(message) => (
          <Text view="alert" size="m">
            {message}
          </Text>
        )}
      </Show>

      <Show
        when={!ownerPayoutsStore.isLoading}
        fallback={
          <div className={styles.loaderWrap}>
            <Loader size="m" />
          </div>
        }
      >
        <DataTable
          items={ownerPayoutsStore.payouts}
          columns={ownerPayoutsColumns}
          emptyText="Нет выплат"
          rowKey={(p) => p.id}
        />
      </Show>
    </Card>
  )
})

