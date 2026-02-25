import { type ReactElement } from 'react'
import { getCoreRowModel, useReactTable } from '@tanstack/react-table'
import type { Manager } from '@/shared/types'
import { managersApi } from './api'
import { useManagers } from './model/useManagers'
import { Table } from '@/shared/ui/Table'
import { AddManagerModal } from './ui/AddManagerModal'
import { createManagersColumns } from './helpers'
import type { CreateManagersColumnsParams } from './model/types'

export function AdminManagersPage(): ReactElement {
  const {
    managers,
    isLoading,
    addManager,
    deleteManager,
    isModalOpen,
    openModal,
    closeModal,
  } = useManagers()

  const columnsParams: CreateManagersColumnsParams = {
    onDeleteManager: deleteManager,
    onPermissionChange: managersApi.updateManager,
  }

  const table = useReactTable<Manager>({
    data: managers,
    columns: createManagersColumns(columnsParams),
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <>
      <Table hasData={managers.length > 0} isLoading={isLoading}>
        <Table.EmptyFallback
          addText="Добавить менеджера"
          addAction={openModal}
        />
        <Table.Card
          title="Список менеджеров"
          table={table}
          onAddClick={openModal}
        />
      </Table>
      <AddManagerModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onAddManager={addManager}
      />
    </>
  )
}
