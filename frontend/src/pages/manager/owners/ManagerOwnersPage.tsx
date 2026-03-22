import { type ReactElement, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { Card, CardBody, CardHeader, Heading, Spinner, Center } from '@chakra-ui/react'
import type { Owner } from '@/shared/types'
import { authStore } from '@/entities/auth'
import { DataTable } from '@/shared/ui/DataTable'
import { ownersColumns } from './model/columns'
import { managerOwnersStore } from './model/manager-owners.store'
import { AddOwnerModal } from './ui/AddOwnerModal'
import { OwnersTableHeader } from './ui/OwnersTableHeader'

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
      <Card>
        <CardHeader pb={2}>
          <Heading size="md">Собственники</Heading>
        </CardHeader>
        <CardBody>
          <OwnersTableHeader />
          {managerOwnersStore.isLoading ? (
            <Center py={8}>
              <Spinner />
            </Center>
          ) : (
            <DataTable
              items={managerOwnersStore.filteredOwners}
              columns={ownersColumns}
              emptyText="Нет собственников"
              rowKey={(o) => o.id}
              onRowClick={handleRowClick}
            />
          )}
        </CardBody>
      </Card>
      {canCreate ? (
        <AddOwnerModal
          isOpen={managerOwnersStore.isModalOpen}
          onClose={() => managerOwnersStore.closeModal()}
          onAddOwner={(v) => managerOwnersStore.addOwner(v)}
        />
      ) : null}
    </>
  )
})
