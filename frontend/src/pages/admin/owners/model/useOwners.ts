import { useState, useEffect, useCallback } from 'react'
import { useDisclosure, useToast } from '@chakra-ui/react'
import { ownersApi } from '../api'
import type { Owner } from '@/shared/types'

interface AddOwnerValues {
  email: string
  password: string
  name: string
  phone?: string
}

export function useOwners() {
  const [owners, setOwners] = useState<Owner[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const {
    isOpen: isModalOpen,
    onOpen: openModal,
    onClose: closeModal,
  } = useDisclosure()
  const toast = useToast()

  const fetchOwners = useCallback(async (): Promise<void> => {
    setIsLoading(true)
    try {
      const data = await ownersApi.getOwners({ search: undefined })
      setOwners(data.items)
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Ошибка загрузки'
      toast({ title: msg, status: 'error', isClosable: true })
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  const addOwner = useCallback(
    async (values: AddOwnerValues): Promise<void> => {
      try {
        await ownersApi.createOwner(values)
        toast({
          title: 'Собственник создан',
          status: 'success',
          isClosable: true,
        })
        closeModal()
        await fetchOwners()
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'Ошибка создания'
        toast({ title: msg, status: 'error', isClosable: true })
        throw e
      }
    },
    [closeModal, fetchOwners, toast],
  )

  useEffect(() => {
    void fetchOwners()
  }, [fetchOwners])

  return {
    owners,
    isLoading,
    addOwner,
    isModalOpen,
    openModal,
    closeModal,
  }
}
