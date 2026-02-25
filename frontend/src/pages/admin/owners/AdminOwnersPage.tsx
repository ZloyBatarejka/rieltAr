import { type ReactElement } from 'react'
import { getCoreRowModel, useReactTable } from '@tanstack/react-table'
import type { Owner } from '@/shared/types'
import { useOwners } from './model/useOwners'
import { Table } from '@/shared/ui/Table'
import { AddOwnerModal } from './ui/AddOwnerModal'
import { createOwnersColumns } from './helpers'

export function AdminOwnersPage(): ReactElement {
  const { owners, isLoading, addOwner, isModalOpen, openModal, closeModal } =
    useOwners()

  const table = useReactTable<Owner>({
    data: owners,
    columns: createOwnersColumns(),
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <>
      <Table hasData={owners.length > 0} isLoading={isLoading}>
        <Table.EmptyFallback
          addText="Добавить собственника"
          addAction={openModal}
        />
        <Table.Card
          title="Список собственников"
          table={table}
          onAddClick={openModal}
        />
      </Table>
      <AddOwnerModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onAddOwner={addOwner}
      />
    </>
  )
}
