import { type ReactElement, useEffect, useMemo } from 'react'
import { observer } from 'mobx-react-lite'
import { Card, CardBody, CardHeader, Heading, Spinner, Center } from '@chakra-ui/react'
import { authStore } from '@/entities/auth'
import { DataTable } from '@/shared/ui/DataTable'
import { managerPropertiesStore } from './model/manager-properties.store'
import { createPropertiesColumns } from './model/columns'
import { PropertiesTableHeader } from './ui/PropertiesTableHeader'
import { PropertyModals } from './ui/PropertyModals'

export const ManagerPropertiesPage = observer(function ManagerPropertiesPage(): ReactElement {
  const canManage = authStore.user?.canCreateProperties === true

  useEffect(() => {
    void managerPropertiesStore.fetchAll()
  }, [])

  const columns = useMemo(
    () =>
      createPropertiesColumns({
        canManage,
        onEdit: (p) => managerPropertiesStore.openEditModal(p),
        onDelete: (p) => void managerPropertiesStore.deleteProperty(p.id),
      }),
    [canManage],
  )

  return (
    <>
      <Card>
        <CardHeader pb={2}>
          <Heading size="md">Объекты</Heading>
        </CardHeader>
        <CardBody>
          <PropertiesTableHeader />
          {managerPropertiesStore.isLoading ? (
            <Center py={8}>
              <Spinner />
            </Center>
          ) : (
            <DataTable
              items={managerPropertiesStore.filteredProperties}
              columns={columns}
              emptyText="Нет объектов"
              rowKey={(p) => p.id}
            />
          )}
        </CardBody>
      </Card>
      <PropertyModals />
    </>
  )
})
