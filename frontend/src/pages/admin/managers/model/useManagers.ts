import { useState, useEffect, useCallback } from 'react'
import { useDisclosure, useToast } from '@chakra-ui/react'
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
  isModalOpen: boolean
  openModal: () => void
  closeModal: () => void
} {
  const [managers, setManagers] = useState<Manager[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const {
    isOpen: isModalOpen,
    onOpen: openModal,
    onClose: closeModal,
  } = useDisclosure()
  const toast = useToast()

  const fetchManagers = useCallback(async (): Promise<void> => {
    setIsLoading(true)
    try {
      const data = await managersApi.getManagers()
      setManagers(data)
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Ошибка загрузки'
      toast({ title: msg, status: 'error', isClosable: true })
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  const addManager = useCallback(
    async (values: AddManagerValues): Promise<void> => {
      try {
        await managersApi.createManager({
          ...values,
          canCreateOwners: false,
          canCreateProperties: false,
        })
        toast({ title: 'Менеджер создан', status: 'success', isClosable: true })
        closeModal()
        await fetchManagers()
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'Ошибка создания'
        toast({ title: msg, status: 'error', isClosable: true })
        throw e
      }
    },
    [closeModal, fetchManagers, toast],
  )

  const deleteManager = useCallback(
    async (id: string, name: string): Promise<void> => {
      if (!confirm(`Удалить менеджера ${name}?`)) return
      try {
        await managersApi.deleteManager(id)
        toast({ title: 'Менеджер удалён', status: 'success', isClosable: true })
        await fetchManagers()
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'Ошибка удаления'
        toast({ title: msg, status: 'error', isClosable: true })
        throw e
      }
    },
    [fetchManagers, toast],
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
    isModalOpen,
    openModal,
    closeModal,
  }
}
