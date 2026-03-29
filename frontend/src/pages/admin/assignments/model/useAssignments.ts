import { useState, useEffect, useCallback } from 'react'
import { assignmentsApi } from '../api'
import type { Assignment, AssignProperty, Manager, Property } from '@/shared/types'

export function useAssignments() {
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [managers, setManagers] = useState<Manager[]>([])
  const [properties, setProperties] = useState<Property[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const openModal = useCallback(() => setIsModalOpen(true), [])
  const closeModal = useCallback(() => setIsModalOpen(false), [])

  const fetchAssignments = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await assignmentsApi.getAssignments()
      setAssignments(data)
    } catch {
      return
    } finally {
      setIsLoading(false)
    }
  }, [])

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
      await assignmentsApi.assignProperty(values)
      closeModal()
      await fetchAssignments()
    },
    [closeModal, fetchAssignments],
  )

  const unassignAssignment = useCallback(
    async (id: string, propertyTitle: string) => {
      if (!confirm(`Снять назначение "${propertyTitle}" с менеджера?`)) return
      await assignmentsApi.unassignProperty(id)
      await fetchAssignments()
    },
    [fetchAssignments],
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
