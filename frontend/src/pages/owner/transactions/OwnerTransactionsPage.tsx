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
import { ownerTransactionsStore } from './model/owner-transactions.store'
import { ownerTransactionsColumns } from './model/columns'
import { OWNER_TYPE_FILTER_ITEMS, type SelectItem } from './model/filters'
import styles from './OwnerTransactionsPage.module.css'

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

  const selectedPropertyItem: SelectItem | null =
    propertyId === null ? null : (propertyFilterItems.find((i) => i.id === propertyId) ?? null)

  return (
    <Card verticalSpace="2xl" horizontalSpace="2xl" className={styles.tableCard}>
      <div className={styles.titleRow}>
        <Text size="xl" weight="bold" as="h1" view="primary" className={styles.heading}>
          Операции
        </Text>
      </div>

      <div className={styles.filters}>
        <div className={styles.filterField}>
          <Select<SelectItem>
            size="s"
            items={propertyFilterItems}
            value={selectedPropertyItem}
            onChange={(item) => ownerTransactionsStore.setFilterPropertyId(item?.id ?? null)}
            getItemLabel={(i) => i.label}
            getItemKey={(i) => i.id}
            label="Объект"
            labelPosition="top"
            placeholder="Все объекты"
          />
        </div>
        <div className={styles.filterField}>
          <Select
            size="s"
            items={OWNER_TYPE_FILTER_ITEMS}
            value={
              typeFilter === null
                ? null
                : (OWNER_TYPE_FILTER_ITEMS.find((i) => i.id === typeFilter) ?? null)
            }
            onChange={(item) => ownerTransactionsStore.setFilterType(item?.id ?? null)}
            getItemLabel={(i) => i.label}
            getItemKey={(i) => i.id}
            label="Тип"
            labelPosition="top"
            placeholder="Все типы"
          />
        </div>
        <div className={styles.filterField}>
          <DatePicker
            type="date"
            size="s"
            labelPosition="top"
            label="Период с"
            value={ownerTransactionsStore.periodFrom}
            onChange={(d) => ownerTransactionsStore.setPeriodFrom(d)}
          />
        </div>
        <div className={styles.filterField}>
          <DatePicker
            type="date"
            size="s"
            labelPosition="top"
            label="по"
            value={ownerTransactionsStore.periodTo}
            onChange={(d) => ownerTransactionsStore.setPeriodTo(d)}
          />
        </div>
        <div className={styles.filterActions}>
          <Button
            size="s"
            view="ghost"
            label="Сбросить"
            onClick={() => void ownerTransactionsStore.resetFilters()}
          />
          <Button
            size="s"
            view="primary"
            label="Применить"
            onClick={() => void ownerTransactionsStore.applyFilters()}
          />
        </div>
      </div>

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

