import { apiClient } from '@/api/api-client'
import type { Manager, CreateManager } from '@/shared/types'
import type { PermissionField } from '../model/types'

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

  updateManager(id: string, field: PermissionField, value: boolean): void {
    console.log(id, field, value)
  },
}
