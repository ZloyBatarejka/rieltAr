import { useState, useEffect, useCallback } from 'react'
import { useDisclosure, useToast } from '@chakra-ui/react'
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
  const {
    isOpen: isCreateModalOpen,
    onOpen: openCreateModal,
    onClose: closeCreateModal,
  } = useDisclosure()
  const {
    isOpen: isEditModalOpen,
    onOpen: openEditModal,
    onClose: closeEditModal,
  } = useDisclosure()
  const toast = useToast()

  const fetchProperties = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await propertiesApi.getProperties()
      setProperties(data.items)
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Ошибка загрузки'
      toast({ title: msg, status: 'error', isClosable: true })
    } finally {
      setIsLoading(false)
    }
  }, [toast])

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
      try {
        await propertiesApi.createProperty(values)
        toast({ title: 'Объект создан', status: 'success', isClosable: true })
        closeCreateModal()
        await fetchProperties()
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'Ошибка создания'
        toast({ title: msg, status: 'error', isClosable: true })
        throw e
      }
    },
    [closeCreateModal, fetchProperties, toast],
  )

  const openEdit = useCallback((prop: Property) => {
    setEditingProperty(prop)
    openEditModal()
  }, [openEditModal])

  const closeEdit = useCallback(() => {
    setEditingProperty(null)
    closeEditModal()
  }, [closeEditModal])

  const updateProperty = useCallback(
    async (values: UpdateProperty) => {
      if (!editingProperty) return
      try {
        await propertiesApi.updateProperty(editingProperty.id, values)
        toast({ title: 'Объект обновлён', status: 'success', isClosable: true })
        closeEdit()
        await fetchProperties()
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'Ошибка обновления'
        toast({ title: msg, status: 'error', isClosable: true })
        throw e
      }
    },
    [editingProperty, closeEdit, fetchProperties, toast],
  )

  const deleteProperty = useCallback(
    async (id: string, title: string) => {
      if (!confirm(`Удалить объект "${title}"?`)) return
      try {
        await propertiesApi.deleteProperty(id)
        toast({ title: 'Объект удалён', status: 'success', isClosable: true })
        if (editingProperty?.id === id) closeEdit()
        await fetchProperties()
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'Ошибка удаления'
        toast({ title: msg, status: 'error', isClosable: true })
        throw e
      }
    },
    [editingProperty, closeEdit, fetchProperties, toast],
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
