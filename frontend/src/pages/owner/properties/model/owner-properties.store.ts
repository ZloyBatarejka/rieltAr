import { makeAutoObservable, runInAction } from 'mobx'
import { apiClient } from '@/api/api-client'
import { authStore, getOwnerProfileId } from '@/entities/auth'
import type { Property } from '@/shared/types'

class OwnerPropertiesStore {
  properties: Property[] = []
  staysCountByPropertyId: Record<string, number> = {}
  isLoading = false
  error: string | null = null

  constructor() {
    makeAutoObservable(this)
  }

  staysCountFor(propertyId: string): number {
    return this.staysCountByPropertyId[propertyId] ?? 0
  }

  async fetch(): Promise<void> {
    this.isLoading = true
    this.error = null
    const ownerId = getOwnerProfileId(authStore.user)
    if (ownerId === undefined) {
      runInAction(() => {
        this.error = 'Не удалось определить профиль собственника.'
        this.isLoading = false
      })
      return
    }
    try {
      const [propertiesList, staysList] = await Promise.all([
        apiClient.getProperties(),
        apiClient.getStays({ ownerId }),
      ])
      const counts: Record<string, number> = {}
      for (const stay of staysList.items) {
        counts[stay.propertyId] = (counts[stay.propertyId] ?? 0) + 1
      }
      runInAction(() => {
        this.properties = propertiesList.items
        this.staysCountByPropertyId = counts
        this.isLoading = false
      })
    } catch {
      runInAction(() => {
        this.properties = []
        this.staysCountByPropertyId = {}
        this.error = 'Не удалось загрузить объекты. Попробуйте позже.'
        this.isLoading = false
      })
    }
  }
}

export const ownerPropertiesStore = new OwnerPropertiesStore()
