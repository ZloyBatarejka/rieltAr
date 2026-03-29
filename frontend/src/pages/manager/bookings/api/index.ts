import { apiClient } from '@/api/api-client'
import type { PropertiesList, CreateStay } from '@/shared/types'

export const bookingsApi = {
  getProperties(): Promise<PropertiesList> {
    return apiClient.getProperties()
  },

  createStay(data: CreateStay): Promise<void> {
    return apiClient.createStay(data)
  },
}
