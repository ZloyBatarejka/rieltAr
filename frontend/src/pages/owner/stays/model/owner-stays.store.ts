import { makeAutoObservable, runInAction } from 'mobx'
import { apiClient } from '@/api/api-client'
import { authStore, getOwnerProfileId } from '@/entities/auth'
import type { Property, Stay, StayDetail, StayTransaction } from '@/shared/types'

class OwnerStaysStore {
  stays: Stay[] = []
  properties: Property[] = []
  propertyFilterId: string | null = null
  expandedStayId: string | null = null
  stayDetailById: Record<string, StayDetail> = {}
  stayDetailErrors: Record<string, string> = {}
  loadingDetailId: string | null = null
  isLoading = false
  error: string | null = null

  constructor() {
    makeAutoObservable(this)
  }

  get filteredStays(): Stay[] {
    if (this.propertyFilterId === null) {
      return this.stays
    }
    return this.stays.filter((s) => s.propertyId === this.propertyFilterId)
  }

  setPropertyFilter(propertyId: string | null): void {
    this.propertyFilterId = propertyId
    this.expandedStayId = null
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
      const [staysList, propertiesList] = await Promise.all([
        apiClient.getStays({ ownerId }),
        apiClient.getProperties(),
      ])
      runInAction(() => {
        this.stays = staysList.items
        this.properties = propertiesList.items
        this.isLoading = false
      })
    } catch {
      runInAction(() => {
        this.stays = []
        this.properties = []
        this.error = 'Не удалось загрузить заезды. Попробуйте позже.'
        this.isLoading = false
      })
    }
  }

  getStayTransactions(stayId: string): StayTransaction[] {
    const detail = this.stayDetailById[stayId]
    if (detail === undefined) {
      return []
    }
    const txs = detail.transactions
    if (!Array.isArray(txs)) {
      return []
    }
    return txs
  }

  toggleExpanded(stayId: string): void {
    if (this.expandedStayId === stayId) {
      this.expandedStayId = null
      return
    }
    this.expandedStayId = stayId
    void this.ensureStayDetail(stayId)
  }

  private async ensureStayDetail(stayId: string): Promise<void> {
    if (this.stayDetailById[stayId] !== undefined) {
      return
    }
    this.loadingDetailId = stayId
    runInAction(() => {
      const next = { ...this.stayDetailErrors }
      delete next[stayId]
      this.stayDetailErrors = next
    })
    try {
      const detail = await apiClient.getStay(stayId)
      runInAction(() => {
        this.stayDetailById[stayId] = detail
        this.loadingDetailId = null
      })
    } catch {
      runInAction(() => {
        this.loadingDetailId = null
        this.stayDetailErrors = {
          ...this.stayDetailErrors,
          [stayId]: 'Не удалось загрузить операции заезда.',
        }
      })
    }
  }
}

export const ownerStaysStore = new OwnerStaysStore()
