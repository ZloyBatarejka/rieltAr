import { apiClient } from '@/api/api-client'
import type { OwnersList, CreateOwner } from '@/shared/types'

export const managerOwnersApi = {
  getOwners(): Promise<OwnersList> {
    return apiClient.getOwners()
  },

  createOwner(data: CreateOwner): ReturnType<typeof apiClient.createOwner> {
    return apiClient.createOwner(data)
  },
}
