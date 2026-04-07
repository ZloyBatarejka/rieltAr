import { type ReactElement, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { Card } from '@consta/uikit/Card'
import { DatePicker } from '@consta/uikit/DatePicker'
import { Loader } from '@consta/uikit/Loader'
import { Select } from '@consta/uikit/Select'
import { Button } from '@consta/uikit/Button'
import { Text } from '@consta/uikit/Text'
import { DataTable } from '@/shared/ui/DataTable'
import { Show } from '@/shared/ui/Show'
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

  const selectedPropertyItem: SelectItem | null =
    propertyId === null ? null : (propertyFilterItems.find((i) => i.id === propertyId) ?? null)

  return (
    <Card verticalSpace="2xl" horizontalSpace="2xl" className={styles.tableCard}>
      <div className={styles.titleRow}>
        <Text size="xl" weight="bold" as="h1" view="primary" className={styles.heading}>
          Выплаты
        </Text>
      </div>

      <div className={styles.filters}>
        <div className={styles.filterField}>
          <Select<SelectItem>
            size="s"
            items={propertyFilterItems}
            value={selectedPropertyItem}
            onChange={(item) => ownerPayoutsStore.setFilterPropertyId(item?.id ?? null)}
            getItemLabel={(i) => i.label}
            getItemKey={(i) => i.id}
            label="Объект"
            labelPosition="top"
            placeholder="Все объекты"
          />
        </div>
        <div className={styles.filterField}>
          <DatePicker
            type="date"
            size="s"
            labelPosition="top"
            label="Период с"
            value={ownerPayoutsStore.periodFrom}
            onChange={(d) => ownerPayoutsStore.setPeriodFrom(d)}
          />
        </div>
        <div className={styles.filterField}>
          <DatePicker
            type="date"
            size="s"
            labelPosition="top"
            label="по"
            value={ownerPayoutsStore.periodTo}
            onChange={(d) => ownerPayoutsStore.setPeriodTo(d)}
          />
        </div>
        <div className={styles.filterActions}>
          <Button
            size="s"
            view="ghost"
            label="Сбросить"
            onClick={() => void ownerPayoutsStore.resetFilters()}
          />
          <Button
            size="s"
            view="primary"
            label="Применить"
            onClick={() => void ownerPayoutsStore.applyFilters()}
          />
        </div>
      </div>

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

