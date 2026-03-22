import { type ReactElement } from 'react'
import { Input, InputGroup, InputLeftElement } from '@chakra-ui/react'
import { SearchIcon } from '@chakra-ui/icons'
import { getCoreRowModel, useReactTable } from '@tanstack/react-table'
import type { Owner } from '@/shared/types'
import { authStore } from '@/entities/auth'
import { useManagerOwners } from './model/useManagerOwners'
import { Table } from '@/shared/ui/Table'
import { AddOwnerModal } from './ui/AddOwnerModal'
import { createOwnersColumns } from './helpers'

export function ManagerOwnersPage(): ReactElement {
  const {
    owners,
    total,
    isLoading,
    search,
    handleSearch,
    addOwner,
    isModalOpen,
    openModal,
    closeModal,
  } = useManagerOwners()

  const canCreate = authStore.user?.canCreateOwners === true

  const table = useReactTable<Owner>({
    data: owners,
    columns: createOwnersColumns(),
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <>
      <Table hasData={owners.length > 0} isLoading={isLoading}>
        <Table.EmptyFallback
          addText={canCreate ? 'Добавить собственника' : undefined}
          addAction={canCreate ? openModal : undefined}
          emptyText="Нет собственников"
        />
        <Table.Card
          title="Собственники"
          table={table}
          onAddClick={canCreate ? openModal : undefined}
          footer={total > 0 ? <p>Всего: {total}</p> : undefined}
        >
          <InputGroup size="sm" maxW="300px" mb={4}>
            <InputLeftElement pointerEvents="none">
              <SearchIcon color="gray.400" />
            </InputLeftElement>
            <Input
              placeholder="Поиск по имени…"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </InputGroup>
        </Table.Card>
      </Table>
      {canCreate ? (
        <AddOwnerModal
          isOpen={isModalOpen}
          onClose={closeModal}
          onAddOwner={addOwner}
        />
      ) : null}
    </>
  )
}
