import { makeAutoObservable, runInAction } from 'mobx'
import { bookingsApi } from '../api'
import type { Property, CreateStay } from '@/shared/types'

class CreateStayStore {
  properties: Property[] = []
  isLoadingProperties = true
  isSubmitting = false

  constructor() {
    makeAutoObservable(this)
  }

  async fetchProperties(): Promise<void> {
    this.isLoadingProperties = true
    try {
      const data = await bookingsApi.getProperties()
      runInAction(() => {
        this.properties = data.items
      })
    } catch {
      // handled by caller
    } finally {
      runInAction(() => {
        this.isLoadingProperties = false
      })
    }
  }

  async createStay(data: CreateStay): Promise<boolean> {
    this.isSubmitting = true
    try {
      await bookingsApi.createStay(data)
      return true
    } catch {
      return false
    } finally {
      runInAction(() => {
        this.isSubmitting = false
      })
    }
  }
}

export const createStayStore = new CreateStayStore()
