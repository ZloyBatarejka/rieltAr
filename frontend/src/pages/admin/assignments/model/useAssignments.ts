import { useState, useEffect, useCallback } from 'react'
import { useDisclosure, useToast } from '@chakra-ui/react'
import { assignmentsApi } from '../api'
import type { Assignment, AssignProperty, Manager, Property } from '@/shared/types'

export function useAssignments() {
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [managers, setManagers] = useState<Manager[]>([])
  const [properties, setProperties] = useState<Property[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { isOpen: isModalOpen, onOpen: openModal, onClose: closeModal } = useDisclosure()
  const toast = useToast()

  const fetchAssignments = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await assignmentsApi.getAssignments()
      setAssignments(data)
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Ошибка загрузки'
      toast({ title: msg, status: 'error', isClosable: true })
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  const fetchManagers = useCallback(async () => {
    try {
      const data = await assignmentsApi.getManagers()
      setManagers(data)
    } catch {
      setManagers([])
    }
  }, [])

  const fetchProperties = useCallback(async () => {
    try {
      const data = await assignmentsApi.getProperties()
      setProperties(data)
    } catch {
      setProperties([])
    }
  }, [])

  useEffect(() => {
    void fetchAssignments()
  }, [fetchAssignments])

  useEffect(() => {
    void fetchManagers()
    void fetchProperties()
  }, [fetchManagers, fetchProperties])

  const addAssignment = useCallback(
    async (values: AssignProperty) => {
      try {
        await assignmentsApi.assignProperty(values)
        toast({ title: 'Назначение создано', status: 'success', isClosable: true })
        closeModal()
        await fetchAssignments()
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'Ошибка назначения'
        toast({ title: msg, status: 'error', isClosable: true })
        throw e
      }
    },
    [closeModal, fetchAssignments, toast],
  )

  const unassignAssignment = useCallback(
    async (id: string, propertyTitle: string) => {
      if (!confirm(`Снять назначение "${propertyTitle}" с менеджера?`)) return
      try {
        await assignmentsApi.unassignProperty(id)
        toast({ title: 'Назначение снято', status: 'success', isClosable: true })
        await fetchAssignments()
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'Ошибка'
        toast({ title: msg, status: 'error', isClosable: true })
        throw e
      }
    },
    [fetchAssignments, toast],
  )

  return {
    assignments,
    managers,
    properties,
    isLoading,
    addAssignment,
    unassignAssignment,
    isModalOpen,
    openModal,
    closeModal,
  }
}
