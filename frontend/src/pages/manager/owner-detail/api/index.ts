import { apiClient } from '@/api/api-client'
import type {
  OwnerDetail,
  PropertiesList,
  StaysList,
  TransactionsList,
  PayoutsList,
  Dashboard,
} from '@/shared/types'

export const ownerDetailApi = {
  getOwner(id: string): Promise<OwnerDetail> {
    return apiClient.getOwner(id)
  },

  getDashboard(ownerId: string): Promise<Dashboard> {
    return apiClient.getOwnerDashboard(ownerId)
  },

  getProperties(ownerId: string): Promise<PropertiesList> {
    return apiClient.getProperties({ ownerId })
  },

  getStays(ownerId: string): Promise<StaysList> {
    return apiClient.getStays({ ownerId })
  },

  getTransactions(ownerId: string): Promise<TransactionsList> {
    return apiClient.getTransactions({ ownerId })
  },

  getPayouts(ownerId: string): Promise<PayoutsList> {
    return apiClient.getPayouts({ ownerId })
  },
}
