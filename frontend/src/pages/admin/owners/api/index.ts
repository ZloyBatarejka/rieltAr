import { apiClient } from '@/api/api-client'
import type { OwnersList, CreateOwner } from '@/shared/types'

export const ownersApi = {
  getOwners(params?: { search?: string }): Promise<OwnersList> {
    return apiClient.getOwners(params)
  },

  createOwner(data: CreateOwner): ReturnType<typeof apiClient.createOwner> {
    return apiClient.createOwner(data)
  },
}
