import { type ReactElement } from 'react'
import { getCoreRowModel, useReactTable } from '@tanstack/react-table'
import type { Assignment } from '@/shared/types'
import { useAssignments } from './model/useAssignments'
import { Table } from '@/shared/ui/Table'
import { AssignPropertyModal } from './ui/AssignPropertyModal'
import { createAssignmentsColumns } from './helpers'

export function AdminAssignmentsPage(): ReactElement {
  const {
    assignments,
    managers,
    properties,
    isLoading,
    addAssignment,
    unassignAssignment,
    isModalOpen,
    openModal,
    closeModal,
  } = useAssignments()

  const table = useReactTable<Assignment>({
    data: assignments,
    columns: createAssignmentsColumns({ onUnassign: unassignAssignment }),
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <>
      <Table hasData={assignments.length > 0} isLoading={isLoading}>
        <Table.EmptyFallback
          addText="Назначить объект"
          addAction={openModal}
        />
        <Table.Card
          title="Менеджеры — объекты"
          table={table}
          onAddClick={openModal}
        />
      </Table>
      <AssignPropertyModal
        isOpen={isModalOpen}
        onClose={closeModal}
        managers={managers}
        properties={properties}
        onAssign={addAssignment}
      />
    </>
  )
}
