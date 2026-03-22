import { useState, useEffect, useCallback } from 'react'
import { useDisclosure, useToast } from '@chakra-ui/react'
import { managerOwnersApi } from '../api'
import type { Owner } from '@/shared/types'

interface AddOwnerValues {
  email: string
  password: string
  name: string
  phone?: string
}

export function useManagerOwners() {
  const [owners, setOwners] = useState<Owner[]>([])
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const {
    isOpen: isModalOpen,
    onOpen: openModal,
    onClose: closeModal,
  } = useDisclosure()
  const toast = useToast()

  const fetchOwners = useCallback(
    async (query?: string): Promise<void> => {
      setIsLoading(true)
      try {
        const data = await managerOwnersApi.getOwners({
          search: query || undefined,
        })
        setOwners(data.items)
        setTotal(data.total)
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'Ошибка загрузки'
        toast({ title: msg, status: 'error', isClosable: true })
      } finally {
        setIsLoading(false)
      }
    },
    [toast],
  )

  const addOwner = useCallback(
    async (values: AddOwnerValues): Promise<void> => {
      try {
        await managerOwnersApi.createOwner(values)
        toast({
          title: 'Собственник создан',
          status: 'success',
          isClosable: true,
        })
        closeModal()
        await fetchOwners(search)
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'Ошибка создания'
        toast({ title: msg, status: 'error', isClosable: true })
        throw e
      }
    },
    [closeModal, fetchOwners, search, toast],
  )

  const handleSearch = useCallback(
    (value: string) => {
      setSearch(value)
      void fetchOwners(value)
    },
    [fetchOwners],
  )

  useEffect(() => {
    void fetchOwners()
  }, [fetchOwners])

  return {
    owners,
    total,
    isLoading,
    search,
    handleSearch,
    addOwner,
    isModalOpen,
    openModal,
    closeModal,
  }
}
