import { type ReactElement, useEffect, useMemo } from 'react'
import { observer } from 'mobx-react-lite'
import { Card } from '@consta/uikit/Card'
import { Text } from '@consta/uikit/Text'
import { Loader } from '@consta/uikit/Loader'
import { authStore } from '@/entities/auth'
import { DataTable } from '@/shared/ui/DataTable'
import { Show } from '@/shared/ui/Show'
import { managerPropertiesStore } from './model/manager-properties.store'
import { createPropertiesColumns } from './model/columns'
import { PropertiesTableHeader } from './ui/PropertiesTableHeader'
import { PropertyModals } from './ui/PropertyModals'
import styles from './ManagerPropertiesPage.module.css'

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
      <Card verticalSpace="2xl" horizontalSpace="2xl" className={styles.tableCard}>
        <Text size="xl" weight="bold" as="h2" view="primary" className={styles.heading}>
          Объекты
        </Text>
        <PropertiesTableHeader />
        <Show
          when={!managerPropertiesStore.isLoading}
          fallback={
            <div className={styles.loaderWrap}>
              <Loader />
            </div>
          }
        >
          <DataTable
            items={managerPropertiesStore.filteredProperties}
            columns={columns}
            emptyText="Нет объектов"
            rowKey={(p) => p.id}
          />
        </Show>
      </Card>
      <PropertyModals />
    </>
  )
})
