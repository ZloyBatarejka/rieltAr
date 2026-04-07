import { type ReactElement, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { useSearchParams } from 'react-router-dom'
import { Button } from '@consta/uikit/Button'
import { Card } from '@consta/uikit/Card'
import { Loader } from '@consta/uikit/Loader'
import { Select } from '@consta/uikit/Select'
import { IconRevert } from '@consta/icons/IconRevert'
import { Text } from '@consta/uikit/Text'
import { DataTable } from '@/shared/ui/DataTable'
import { Show } from '@/shared/ui/Show'
import { ownerStaysStore } from './model/owner-stays.store'
import { ownerStaysListColumns } from './model/owner-stays-list-columns'
import { ownerStayTransactionsColumns } from './model/owner-stay-transactions-columns'
import styles from './OwnerStaysPage.module.css'

interface PropertyFilterItem {
  id: string
  label: string
}

export const OwnerStaysPage = observer(function OwnerStaysPage(): ReactElement {
  const [searchParams, setSearchParams] = useSearchParams()

  useEffect(() => {
    void ownerStaysStore.fetch()
  }, [])

  useEffect(() => {
    const raw = searchParams.get('propertyId')
    if (raw === null || raw === '') {
      ownerStaysStore.setPropertyFilter(null)
    } else {
      ownerStaysStore.setPropertyFilter(raw)
    }
  }, [searchParams])

  const {
    filteredStays,
    properties,
    propertyFilterId,
    expandedStayId,
    stayDetailErrors,
    loadingDetailId,
    isLoading,
    error,
  } = ownerStaysStore

  const propertyFilterItems: PropertyFilterItem[] = properties.map((p) => ({
    id: p.id,
    label: p.title,
  }))

  const selectedPropertyItem: PropertyFilterItem | null =
    propertyFilterId === null
      ? null
      : (propertyFilterItems.find((i) => i.id === propertyFilterId) ?? null)

  const setFilterAndUrl = (propertyId: string | null): void => {
    ownerStaysStore.setPropertyFilter(propertyId)
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      if (propertyId === null) {
        next.delete('propertyId')
      } else {
        next.set('propertyId', propertyId)
      }
      return next
    })
  }

  return (
    <Card verticalSpace="2xl" horizontalSpace="2xl" className={styles.wrap}>
      <Text size="xl" weight="bold" as="h1" view="primary" className={styles.heading}>
        Заезды
      </Text>
      <Text view="secondary" size="m" className={styles.lead}>
        Выберите заезд в таблице — ниже появятся операции по нему. Повторный клик по строке
        сворачивает блок.
      </Text>

      <div className={styles.filterRow}>
        <div className={styles.filterSelect}>
          <Select<PropertyFilterItem>
            size="s"
            items={propertyFilterItems}
            value={selectedPropertyItem}
            onChange={(item) => {
              setFilterAndUrl(item?.id ?? null)
            }}
            getItemLabel={(i) => i.label}
            getItemKey={(i) => i.id}
            label="Объект"
            labelPosition="top"
            placeholder="Все объекты"
          />
        </div>
        <Button
          type="button"
          size="s"
          view="ghost"
          onlyIcon
          iconLeft={IconRevert}
          title="Сбросить фильтр по объекту"
          disabled={propertyFilterId === null}
          onClick={() => {
            setFilterAndUrl(null)
          }}
        />
      </div>

      <Show when={error}>
        {(message) => (
          <Text view="alert" size="m">
            {message}
          </Text>
        )}
      </Show>

      <Show when={isLoading}>
        <div className={styles.loaderWrap}>
          <Loader size="m" />
        </div>
      </Show>

      <Show when={!isLoading && error === null}>
        <DataTable
          items={filteredStays}
          columns={ownerStaysListColumns}
          emptyText="Нет заездов для выбранных условий."
          rowKey={(s) => s.id}
          onRowClick={(s) => {
            ownerStaysStore.toggleExpanded(s.id)
          }}
        />
      </Show>

      <Show when={expandedStayId}>
        {(stayId) => {
          const guestLabel =
            filteredStays.find((s) => s.id === stayId)?.guestName ?? 'Заезд'
          return (
            <div className={styles.detailPanel}>
              <Text
                size="m"
                weight="semibold"
                view="primary"
                className={styles.detailTitle}
              >
                Операции — {guestLabel}
              </Text>
              <Show when={loadingDetailId === stayId}>
                <div className={styles.loaderWrap}>
                  <Loader size="s" />
                </div>
              </Show>
              <Show when={stayDetailErrors[stayId] !== undefined}>
                <Text view="alert" size="s" className={styles.detailError}>
                  {stayDetailErrors[stayId] ?? ''}
                </Text>
              </Show>
              <Show when={loadingDetailId !== stayId && stayDetailErrors[stayId] === undefined}>
                <DataTable
                  items={ownerStaysStore.getStayTransactions(stayId)}
                  columns={ownerStayTransactionsColumns}
                  emptyText="Нет операций по заезду"
                  rowKey={(tx) => tx.id}
                />
              </Show>
            </div>
          )
        }}
      </Show>
    </Card>
  )
})
