import { type ReactElement, useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { Card } from '@consta/uikit/Card'
import { Text } from '@consta/uikit/Text'
import { Loader } from '@consta/uikit/Loader'
import { Button } from '@consta/uikit/Button'
import { IconAdd } from '@consta/icons/IconAdd'
import { DataTable } from '@/shared/ui/DataTable'
import { Show } from '@/shared/ui/Show'
import { payoutsPageStore } from './model/payouts-page.store'
import { managerPayoutsColumns } from './model/columns'
import { CreatePayoutModal } from './ui/CreatePayoutModal'
import styles from './ManagerPayoutsPage.module.css'

export const ManagerPayoutsPage = observer(function ManagerPayoutsPage(): ReactElement {
  const [createOpen, setCreateOpen] = useState(false)

  useEffect(() => {
    void payoutsPageStore.fetchOwners()
    void payoutsPageStore.fetchPayouts()
  }, [])

  return (
    <>
      <Card verticalSpace="2xl" horizontalSpace="2xl" className={styles.tableCard}>
        <div className={styles.titleRow}>
          <Text size="xl" weight="bold" as="h2" view="primary" className={styles.heading}>
            Выплаты
          </Text>
          <Button
            size="s"
            view="primary"
            onlyIcon
            iconLeft={IconAdd}
            onClick={() => setCreateOpen(true)}
          />
        </div>

        <Show
          when={!payoutsPageStore.isLoading}
          fallback={
            <div className={styles.loaderWrap}>
              <Loader />
            </div>
          }
        >
          <DataTable
            items={payoutsPageStore.payouts}
            columns={managerPayoutsColumns}
            emptyText="Нет выплат"
            rowKey={(p) => p.id}
          />
        </Show>
      </Card>

      <CreatePayoutModal isOpen={createOpen} onClose={() => setCreateOpen(false)} />
    </>
  )
})
