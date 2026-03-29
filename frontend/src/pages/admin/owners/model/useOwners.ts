import { useState, useEffect, useCallback } from 'react'
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
  const [isModalOpen, setIsModalOpen] = useState(false)
  const openModal = useCallback(() => setIsModalOpen(true), [])
  const closeModal = useCallback(() => setIsModalOpen(false), [])

  const fetchOwners = useCallback(async (): Promise<void> => {
    setIsLoading(true)
    try {
      const data = await ownersApi.getOwners({ search: undefined })
      setOwners(data.items)
    } catch {
      return
    } finally {
      setIsLoading(false)
    }
  }, [])

  const addOwner = useCallback(
    async (values: AddOwnerValues): Promise<void> => {
      await ownersApi.createOwner(values)
      closeModal()
      await fetchOwners()
    },
    [closeModal, fetchOwners],
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
