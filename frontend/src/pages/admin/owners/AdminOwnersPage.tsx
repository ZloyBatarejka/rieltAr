import { type ReactElement, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCoreRowModel, useReactTable } from '@tanstack/react-table'
import type { Owner } from '@/shared/types'
import { useOwners } from './model/useOwners'
import { Table } from '@/shared/ui/Table'
import { AddOwnerModal } from './ui/AddOwnerModal'
import { createOwnersColumns } from './helpers'

export function AdminOwnersPage(): ReactElement {
  const navigate = useNavigate()
  const { owners, isLoading, addOwner, isModalOpen, openModal, closeModal } =
    useOwners()

  const handleRowClick = useCallback(
    (owner: Owner) => {
      navigate(`/admin/owners/${owner.id}`)
    },
    [navigate],
  )

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
          onRowClick={handleRowClick}
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
