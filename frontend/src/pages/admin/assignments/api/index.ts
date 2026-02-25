import { apiClient } from '@/api/api-client'
import type { Assignment, AssignProperty, Manager, Property } from '@/shared/types'

export const assignmentsApi = {
  getAssignments(): Promise<Assignment[]> {
    return apiClient.getAssignments()
  },

  getManagers(): Promise<Manager[]> {
    return apiClient.getManagers()
  },

  getProperties(): Promise<Property[]> {
    return apiClient.getProperties().then((r) => r.items)
  },

  assignProperty(data: AssignProperty): Promise<Assignment> {
    return apiClient.assignProperty(data)
  },

  unassignProperty(id: string): Promise<void> {
    return apiClient.unassignProperty(id)
  },
}
