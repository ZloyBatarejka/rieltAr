import { makeAutoObservable, runInAction } from 'mobx'
import { apiClient } from '@/api/api-client'
import type { CreatePayout, Owner, Property, Payout } from '@/shared/types'

class PayoutsPageStore {
  owners: Owner[] = []
  payouts: Payout[] = []

  propertiesForSelectedOwner: Property[] = []
  selectedOwnerBalance: number | null = null

  isLoading = true
  isLoadingOwnerContext = false
  isSubmitting = false

  constructor() {
    makeAutoObservable(this)
  }

  async fetchOwners(): Promise<void> {
    try {
      const data = await apiClient.getOwners()
      runInAction(() => {
        this.owners = data.items
      })
    } catch {
      runInAction(() => {
        this.owners = []
      })
    }
  }

  async fetchPayouts(): Promise<void> {
    this.isLoading = true
    try {
      const data = await apiClient.getPayouts()
      runInAction(() => {
        this.payouts = data.items
      })
    } catch {
      runInAction(() => {
        this.payouts = []
      })
    } finally {
      runInAction(() => {
        this.isLoading = false
      })
    }
  }

  async loadOwnerContext(ownerId: string): Promise<void> {
    this.isLoadingOwnerContext = true
    try {
      const [propsData, dashboard] = await Promise.all([
        apiClient.getProperties({ ownerId }),
        apiClient.getOwnerDashboard(ownerId),
      ])
      runInAction(() => {
        this.propertiesForSelectedOwner = propsData.items
        this.selectedOwnerBalance = dashboard.balance
      })
    } catch {
      runInAction(() => {
        this.propertiesForSelectedOwner = []
        this.selectedOwnerBalance = null
      })
    } finally {
      runInAction(() => {
        this.isLoadingOwnerContext = false
      })
    }
  }

  clearOwnerContext(): void {
    this.propertiesForSelectedOwner = []
    this.selectedOwnerBalance = null
  }

  async createPayout(data: CreatePayout): Promise<boolean> {
    this.isSubmitting = true
    try {
      await apiClient.createPayout(data)
      await this.fetchPayouts()
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

export const payoutsPageStore = new PayoutsPageStore()
