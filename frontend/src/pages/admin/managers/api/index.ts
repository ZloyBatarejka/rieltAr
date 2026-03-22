import { apiClient } from '@/api/api-client'
import type {
  Manager,
  CreateManager,
} from '@/shared/types'

export const managersApi = {
  getManagers(): Promise<Manager[]> {
    return apiClient.getManagers()
  },

  createManager(data: CreateManager): Promise<Manager> {
    return apiClient.createManager(data)
  },

  deleteManager(id: string): Promise<void> {
    return apiClient.deleteManager(id)
  },

  updateCanCreateOwners(id: string, value: boolean): Promise<Manager> {
    return apiClient.updateManagerPermissions(id, {
      canCreateOwners: value,
    })
  },

  updateCanCreateProperties(id: string, value: boolean): Promise<Manager> {
    return apiClient.updateManagerPermissions(id, {
      canCreateProperties: value,
    })
  },
}
