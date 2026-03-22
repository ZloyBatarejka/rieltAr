import { useState, useEffect, useCallback } from 'react'
import { useToast } from '@chakra-ui/react'
import { ownerDetailApi } from '../api'
import type {
  OwnerDetail,
  Dashboard,
  Property,
  Stay,
  Transaction,
  Payout,
} from '@/shared/types'

export function useOwnerDetail(ownerId: string) {
  const [owner, setOwner] = useState<OwnerDetail | null>(null)
  const [dashboard, setDashboard] = useState<Dashboard | null>(null)
  const [properties, setProperties] = useState<Property[]>([])
  const [stays, setStays] = useState<Stay[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [payouts, setPayouts] = useState<Payout[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const toast = useToast()

  const fetchAll = useCallback(async (): Promise<void> => {
    setIsLoading(true)
    try {
      const [ownerData, dashboardData, propsData, staysData, txData, payoutsData] =
        await Promise.all([
          ownerDetailApi.getOwner(ownerId),
          ownerDetailApi.getDashboard(ownerId),
          ownerDetailApi.getProperties(ownerId),
          ownerDetailApi.getStays(ownerId),
          ownerDetailApi.getTransactions(ownerId),
          ownerDetailApi.getPayouts(ownerId),
        ])

      setOwner(ownerData)
      setDashboard(dashboardData)
      setProperties(propsData.items)
      setStays(staysData.items)
      setTransactions(txData.items)
      setPayouts(payoutsData.items)
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Ошибка загрузки'
      toast({ title: msg, status: 'error', isClosable: true })
    } finally {
      setIsLoading(false)
    }
  }, [ownerId, toast])

  useEffect(() => {
    void fetchAll()
  }, [fetchAll])

  return {
    owner,
    dashboard,
    properties,
    stays,
    transactions,
    payouts,
    isLoading,
    refetch: fetchAll,
  }
}
