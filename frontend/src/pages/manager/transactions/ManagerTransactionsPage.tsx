import { type ReactElement, useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { Card } from '@consta/uikit/Card'
import { Text } from '@consta/uikit/Text'
import { Loader } from '@consta/uikit/Loader'
import { Button } from '@consta/uikit/Button'
import { Select } from '@consta/uikit/Select'
import { DatePicker } from '@consta/uikit/DatePicker'
import { IconAdd } from '@consta/icons/IconAdd'
import { DataTable } from '@/shared/ui/DataTable'
import { Show } from '@/shared/ui/Show'
import { transactionsPageStore } from './model/transactions-page.store'
import { managerTransactionsColumns } from './model/columns'
import { TYPE_FILTER_ITEMS, type OwnerPropertySelectItem } from './model/filters'
import { AddTransactionModal } from './ui/AddTransactionModal'
import styles from './ManagerTransactionsPage.module.css'

export const ManagerTransactionsPage = observer(
  function ManagerTransactionsPage(): ReactElement {
    const [addOpen, setAddOpen] = useState(false)

    useEffect(() => {
      void transactionsPageStore.fetchDictionaries()
      void transactionsPageStore.fetchTransactions()
    }, [])

    const ownerFilterItems: OwnerPropertySelectItem[] = transactionsPageStore.owners.map(
      (o) => ({ id: o.id, label: o.name }),
    )

    const propertyFilterItems: OwnerPropertySelectItem[] =
      transactionsPageStore.properties.map((p) => ({
        id: p.id,
        label: p.title,
      }))

    const ownerId = transactionsPageStore.filterOwnerId
    const propertyId = transactionsPageStore.filterPropertyId
    const typeFilter = transactionsPageStore.filterType

    return (
      <>
        <Card
          verticalSpace="2xl"
          horizontalSpace="2xl"
          className={styles.tableCard}
        >
          <div className={styles.titleRow}>
            <Text
              size="xl"
              weight="bold"
              as="h2"
              view="primary"
              className={styles.heading}
            >
              Операции
            </Text>
            <Button
              size="s"
              view="primary"
              onlyIcon
              iconLeft={IconAdd}
              onClick={() => setAddOpen(true)}
            />
          </div>

          <div className={styles.filters}>
            <div className={styles.filterField}>
              <Select
                size="s"
                items={ownerFilterItems}
                value={
                  ownerId === null
                    ? null
                    : (ownerFilterItems.find((i) => i.id === ownerId) ?? null)
                }
                onChange={(item) => transactionsPageStore.setFilterOwnerId(item?.id ?? null)}
                getItemLabel={(i) => i.label}
                getItemKey={(i) => i.id}
                label="Собственник"
                labelPosition="top"
                placeholder="Не выбран"
              />
            </div>
            <div className={styles.filterField}>
              <Select
                size="s"
                items={propertyFilterItems}
                value={
                  propertyId === null
                    ? null
                    : (propertyFilterItems.find((i) => i.id === propertyId) ?? null)
                }
                onChange={(item) =>
                  transactionsPageStore.setFilterPropertyId(item?.id ?? null)
                }
                getItemLabel={(i) => i.label}
                getItemKey={(i) => i.id}
                label="Объект"
                labelPosition="top"
                placeholder="Не выбран"
              />
            </div>
            <div className={styles.filterField}>
              <Select
                size="s"
                items={TYPE_FILTER_ITEMS}
                value={
                  typeFilter === null
                    ? null
                    : (TYPE_FILTER_ITEMS.find((i) => i.id === typeFilter) ?? null)
                }
                onChange={(item) =>
                  transactionsPageStore.setFilterType(item?.id ?? null)
                }
                getItemLabel={(i) => i.label}
                getItemKey={(i) => i.id}
                label="Тип"
                labelPosition="top"
                placeholder="Не выбран"
              />
            </div>
            <div className={styles.filterField}>
              <DatePicker
                type="date"
                size="s"
                labelPosition="top"
                label="Период с"
                value={transactionsPageStore.periodFrom}
                onChange={(d) => transactionsPageStore.setPeriodFrom(d)}
              />
            </div>
            <div className={styles.filterField}>
              <DatePicker
                type="date"
                size="s"
                labelPosition="top"
                label="по"
                value={transactionsPageStore.periodTo}
                onChange={(d) => transactionsPageStore.setPeriodTo(d)}
              />
            </div>
            <div className={styles.filterActions}>
              <Button
                size="s"
                view="ghost"
                label="Сбросить"
                onClick={() => void transactionsPageStore.resetFilters()}
              />
              <Button
                size="s"
                view="primary"
                label="Применить"
                onClick={() => void transactionsPageStore.applyFilters()}
              />
            </div>
          </div>

          <Show
            when={!transactionsPageStore.isLoading}
            fallback={
              <div className={styles.loaderWrap}>
                <Loader />
              </div>
            }
          >
            <DataTable
              items={transactionsPageStore.transactions}
              columns={managerTransactionsColumns}
              emptyText="Нет операций"
              rowKey={(t) => t.id}
            />
          </Show>
        </Card>

        <AddTransactionModal
          isOpen={addOpen}
          onClose={() => setAddOpen(false)}
          onAdd={async (data) => {
            const ok = await transactionsPageStore.createTransaction(data)
            if (ok) setAddOpen(false)
            return ok
          }}
          properties={transactionsPageStore.properties}
          isSubmitting={transactionsPageStore.isSubmitting}
        />
      </>
    )
  },
)
