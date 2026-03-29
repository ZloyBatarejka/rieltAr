import { useState, useEffect, useCallback } from 'react'
import { managersApi } from '../api'
import type { Manager } from '@/shared/types'

interface AddManagerValues {
  email: string
  password: string
  name: string
}

export function useManagers(): {
  managers: Manager[]
  isLoading: boolean
  fetchManagers: () => Promise<void>
  addManager: (values: AddManagerValues) => Promise<void>
  deleteManager: (id: string, name: string) => Promise<void>
  updateManagerPermission: (
    id: string,
    field: 'canCreateOwners' | 'canCreateProperties',
    value: boolean,
  ) => Promise<void>
  isModalOpen: boolean
  openModal: () => void
  closeModal: () => void
} {
  const [managers, setManagers] = useState<Manager[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const openModal = useCallback(() => setIsModalOpen(true), [])
  const closeModal = useCallback(() => setIsModalOpen(false), [])

  const fetchManagers = useCallback(async (): Promise<void> => {
    setIsLoading(true)
    try {
      const data = await managersApi.getManagers()
      setManagers(data)
    } catch {
      return
    } finally {
      setIsLoading(false)
    }
  }, [])

  const addManager = useCallback(
    async (values: AddManagerValues): Promise<void> => {
      await managersApi.createManager({
        ...values,
        canCreateOwners: false,
        canCreateProperties: false,
      })
      closeModal()
      await fetchManagers()
    },
    [closeModal, fetchManagers],
  )

  const deleteManager = useCallback(
    async (id: string, name: string): Promise<void> => {
      if (!confirm(`Удалить менеджера ${name}?`)) return
      await managersApi.deleteManager(id)
      await fetchManagers()
    },
    [fetchManagers],
  )

  const updateManagerPermission = useCallback(
    async (
      id: string,
      field: 'canCreateOwners' | 'canCreateProperties',
      value: boolean,
    ): Promise<void> => {
      try {
        const updatedManager =
          field === 'canCreateOwners'
            ? await managersApi.updateCanCreateOwners(id, value)
            : await managersApi.updateCanCreateProperties(id, value)

        setManagers((prevManagers) =>
          prevManagers.map((manager) =>
            manager.id === id ? updatedManager : manager,
          ),
        )
      } catch {
        await fetchManagers()
      }
    },
    [fetchManagers],
  )

  useEffect(() => {
    void fetchManagers()
  }, [fetchManagers])

  return {
    managers,
    isLoading,
    fetchManagers,
    addManager,
    deleteManager,
    updateManagerPermission,
    isModalOpen,
    openModal,
    closeModal,
  }
}
