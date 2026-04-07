import { type ReactElement, useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { Card } from '@consta/uikit/Card'
import { Text } from '@consta/uikit/Text'
import { Loader } from '@consta/uikit/Loader'
import { Button } from '@consta/uikit/Button'
import { IconAdd } from '@consta/icons/IconAdd'
import { DataTable } from '@/shared/ui/DataTable'
import { Show } from '@/shared/ui/Show'
import { RecordsFilters } from '@/features/records-filters'
import { transactionsPageStore } from './model/transactions-page.store'
import { managerTransactionsColumns } from './model/columns'
import { TYPE_FILTER_ITEMS, type OwnerPropertySelectItem } from './model/filters'
import type { TransactionType } from '@/shared/types'
import { AddTransactionModal } from './ui/AddTransactionModal'
import styles from './ManagerTransactionsPage.module.css'

function isTransactionType(value: string): value is TransactionType {
  return TYPE_FILTER_ITEMS.some((i) => i.id === value)
}

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

          <RecordsFilters
            ownerItems={ownerFilterItems}
            ownerId={ownerId}
            onOwnerChange={(id) => transactionsPageStore.setFilterOwnerId(id)}
            ownerPlaceholder="Не выбран"
            propertyItems={propertyFilterItems}
            propertyId={propertyId}
            onPropertyChange={(id) => transactionsPageStore.setFilterPropertyId(id)}
            propertyPlaceholder="Не выбран"
            typeItems={TYPE_FILTER_ITEMS}
            typeId={typeFilter}
            onTypeChange={(t) =>
              transactionsPageStore.setFilterType(t !== null && isTransactionType(t) ? t : null)
            }
            typePlaceholder="Не выбран"
            from={transactionsPageStore.periodFrom}
            to={transactionsPageStore.periodTo}
            onFromChange={(d) => transactionsPageStore.setPeriodFrom(d)}
            onToChange={(d) => transactionsPageStore.setPeriodTo(d)}
            onReset={() => void transactionsPageStore.resetFilters()}
            onApply={() => void transactionsPageStore.applyFilters()}
          />

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
