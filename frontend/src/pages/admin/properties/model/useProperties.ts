import { useState, useEffect, useCallback } from 'react'
import { propertiesApi } from '../api'
import type {
  Property,
  Owner,
  CreateProperty,
  UpdateProperty,
} from '@/shared/types'

export function useProperties() {
  const [properties, setProperties] = useState<Property[]>([])
  const [owners, setOwners] = useState<Owner[]>([])
  const [editingProperty, setEditingProperty] = useState<Property | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const openCreateModal = useCallback(() => setIsCreateModalOpen(true), [])
  const closeCreateModal = useCallback(() => setIsCreateModalOpen(false), [])
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const openEditModal = useCallback(() => setIsEditModalOpen(true), [])
  const closeEditModal = useCallback(() => setIsEditModalOpen(false), [])

  const fetchProperties = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await propertiesApi.getProperties()
      setProperties(data.items)
    } catch {
      return
    } finally {
      setIsLoading(false)
    }
  }, [])

  const fetchOwners = useCallback(async () => {
    try {
      const data = await propertiesApi.getOwners()
      setOwners(data.items)
    } catch {
      setOwners([])
    }
  }, [])

  useEffect(() => {
    void fetchProperties()
    void fetchOwners()
  }, [fetchProperties, fetchOwners])

  const addProperty = useCallback(
    async (values: CreateProperty) => {
      await propertiesApi.createProperty(values)
      closeCreateModal()
      await fetchProperties()
    },
    [closeCreateModal, fetchProperties],
  )

  const openEdit = useCallback(
    (prop: Property) => {
      setEditingProperty(prop)
      openEditModal()
    },
    [openEditModal],
  )

  const closeEdit = useCallback(() => {
    closeEditModal()
  }, [closeEditModal])

  const updateProperty = useCallback(
    async (values: UpdateProperty) => {
      if (!editingProperty) return
      await propertiesApi.updateProperty(editingProperty.id, values)
      closeEdit()
      await fetchProperties()
    },
    [editingProperty, closeEdit, fetchProperties],
  )

  const deleteProperty = useCallback(
    async (id: string, title: string) => {
      if (!confirm(`Удалить объект "${title}"?`)) return
      await propertiesApi.deleteProperty(id)
      if (editingProperty?.id === id) closeEdit()
      await fetchProperties()
    },
    [editingProperty, closeEdit, fetchProperties],
  )

  return {
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
  }
}
