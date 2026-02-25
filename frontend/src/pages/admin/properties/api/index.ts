import { apiClient } from '@/api/api-client'
import type {
  PropertiesList,
  CreateProperty,
  UpdateProperty,
  Property,
  OwnersList,
} from '@/shared/types'

export const propertiesApi = {
  getProperties(): Promise<PropertiesList> {
    return apiClient.getProperties()
  },

  getOwners(): Promise<OwnersList> {
    return apiClient.getOwners()
  },

  createProperty(data: CreateProperty): Promise<Property> {
    return apiClient.createProperty(data)
  },

  updateProperty(id: string, data: UpdateProperty): Promise<Property> {
    return apiClient.updateProperty(id, data)
  },

  deleteProperty(id: string): Promise<void> {
    return apiClient.deleteProperty(id)
  },
}
