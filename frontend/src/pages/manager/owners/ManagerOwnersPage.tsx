import { type ReactElement, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { Card } from '@consta/uikit/Card'
import { Text } from '@consta/uikit/Text'
import { Loader } from '@consta/uikit/Loader'
import type { Owner } from '@/shared/types'
import { authStore } from '@/entities/auth'
import { DataTable } from '@/shared/ui/DataTable'
import { Show } from '@/shared/ui/Show'
import { ownersColumns } from './model/columns'
import { managerOwnersStore } from './model/manager-owners.store'
import { AddOwnerModal } from './ui/AddOwnerModal'
import { OwnersTableHeader } from './ui/OwnersTableHeader'
import styles from './ManagerOwnersPage.module.css'

export const ManagerOwnersPage = observer(function ManagerOwnersPage(): ReactElement {
  const navigate = useNavigate()
  const canCreate = authStore.user?.canCreateOwners === true

  useEffect(() => {
    void managerOwnersStore.fetchOwners()
  }, [])

  const handleRowClick = useCallback(
    (owner: Owner) => navigate(`/manager/owners/${owner.id}`),
    [navigate],
  )

  return (
    <>
      <Card verticalSpace="2xl" horizontalSpace="2xl" className={styles.tableCard}>
        <Text size="xl" weight="bold" as="h2" view="primary" className={styles.heading}>
          Собственники
        </Text>
        <OwnersTableHeader />
        <Show
          when={!managerOwnersStore.isLoading}
          fallback={
            <div className={styles.loaderWrap}>
              <Loader />
            </div>
          }
        >
          <DataTable
            items={managerOwnersStore.filteredOwners}
            columns={ownersColumns}
            emptyText="Нет собственников"
            rowKey={(o) => o.id}
            onRowClick={handleRowClick}
          />
        </Show>
      </Card>
      <Show when={canCreate}>
        <AddOwnerModal
          isOpen={managerOwnersStore.isModalOpen}
          onClose={() => managerOwnersStore.closeModal()}
          onAddOwner={(v) => managerOwnersStore.addOwner(v)}
        />
      </Show>
    </>
  )
})
