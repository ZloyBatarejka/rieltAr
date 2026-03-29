import { makeAutoObservable, runInAction } from 'mobx'
import { apiClient } from '@/api/api-client'
import type { Stay } from '@/shared/types'

class BookingsPageStore {
  stays: Stay[] = []
  isLoading = true

  constructor() {
    makeAutoObservable(this)
  }

  async fetchStays(): Promise<void> {
    this.isLoading = true
    try {
      const data = await apiClient.getStays()
      runInAction(() => {
        this.stays = data.items
      })
    } catch {
      // handled by caller
    } finally {
      runInAction(() => {
        this.isLoading = false
      })
    }
  }
}

export const bookingsPageStore = new BookingsPageStore()
