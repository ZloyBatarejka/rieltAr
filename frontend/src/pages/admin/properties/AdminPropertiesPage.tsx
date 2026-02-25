import { type ReactElement } from 'react'
import { getCoreRowModel, useReactTable } from '@tanstack/react-table'
import type { Property } from '@/shared/types'
import { useProperties } from './model/useProperties'
import { Table } from '@/shared/ui/Table'
import { AddPropertyModal } from './ui/AddPropertyModal'
import { EditPropertyModal } from './ui/EditPropertyModal'
import { createPropertiesColumns } from './helpers'

export function AdminPropertiesPage(): ReactElement {
  const {
    properties,
    owners,
    isLoading,
    addProperty,
    updateProperty,
    deleteProperty,
    isCreateModalOpen,
    openCreateModal,
    closeCreateModal,
    isEditModalOpen,
    openEdit,
    closeEdit,
    editingProperty,
  } = useProperties()

  const table = useReactTable<Property>({
    data: properties,
    columns: createPropertiesColumns({
      onEdit: openEdit,
      onDelete: deleteProperty,
    }),
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <>
      <Table hasData={properties.length > 0} isLoading={isLoading}>
        <Table.EmptyFallback
          addText="Добавить объект"
          addAction={openCreateModal}
        />
        <Table.Card
          title="Список объектов"
          table={table}
          onAddClick={openCreateModal}
        />
      </Table>
      <AddPropertyModal
        isOpen={isCreateModalOpen}
        onClose={closeCreateModal}
        owners={owners}
        onAddProperty={addProperty}
      />
      <EditPropertyModal
        isOpen={isEditModalOpen}
        onClose={closeEdit}
        property={editingProperty}
        owners={owners}
        onSave={updateProperty}
      />
    </>
  )
}
