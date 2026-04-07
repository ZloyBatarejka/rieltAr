import { makeAutoObservable, runInAction } from 'mobx'
import { apiClient } from '@/api/api-client'
import type { Payout, Property } from '@/shared/types'
import type { PayoutsControllerFindAllParams } from '@/api/generated/Api'

function startOfDayIso(d: Date): string {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0).toISOString()
}

function endOfDayIso(d: Date): string {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999).toISOString()
}

class OwnerPayoutsStore {
  properties: Property[] = []
  payouts: Payout[] = []
  total = 0

  isLoading = true
  error: string | null = null

  filterPropertyId: string | null = null
  periodFrom: Date | null = null
  periodTo: Date | null = null

  constructor() {
    makeAutoObservable(this)
  }

  setFilterPropertyId(value: string | null): void {
    this.filterPropertyId = value
  }

  setPeriodFrom(value: Date | null): void {
    this.periodFrom = value
  }

  setPeriodTo(value: Date | null): void {
    this.periodTo = value
  }

  private buildQuery(): PayoutsControllerFindAllParams {
    const params: PayoutsControllerFindAllParams = {}
    params.propertyId = this.filterPropertyId ?? undefined
    params.from = this.periodFrom ? startOfDayIso(this.periodFrom) : undefined
    params.to = this.periodTo ? endOfDayIso(this.periodTo) : undefined
    return params
  }

  async fetchDictionaries(): Promise<void> {
    try {
      const propertiesData = await apiClient.getProperties()
      runInAction(() => {
        this.properties = propertiesData.items
      })
    } catch {
      // без тостов
    }
  }

  async fetchPayouts(): Promise<void> {
    this.isLoading = true
    this.error = null
    try {
      const data = await apiClient.getPayouts(this.buildQuery())
      runInAction(() => {
        this.payouts = data.items
        this.total = data.total
      })
    } catch {
      runInAction(() => {
        this.payouts = []
        this.total = 0
        this.error = 'Не удалось загрузить выплаты.'
      })
    } finally {
      runInAction(() => {
        this.isLoading = false
      })
    }
  }

  async applyFilters(): Promise<void> {
    await this.fetchPayouts()
  }

  async resetFilters(): Promise<void> {
    runInAction(() => {
      this.filterPropertyId = null
      this.periodFrom = null
      this.periodTo = null
    })
    await this.fetchPayouts()
  }
}

export const ownerPayoutsStore = new OwnerPayoutsStore()

