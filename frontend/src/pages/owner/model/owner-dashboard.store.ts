import { makeAutoObservable, runInAction } from 'mobx'
import { apiClient } from '@/api/api-client'
import type { Dashboard } from '@/shared/types'
import type { PeriodEnum } from '@/api/generated/Api'

export type OwnerDashboardPeriod = PeriodEnum

class OwnerDashboardStore {
  period: OwnerDashboardPeriod = 'month'
  dashboard: Dashboard | null = null
  isLoading = false
  error: string | null = null

  constructor() {
    makeAutoObservable(this)
  }

  setPeriod(period: OwnerDashboardPeriod): void {
    this.period = period
    void this.fetch()
  }

  async fetch(): Promise<void> {
    this.isLoading = true
    this.error = null
    try {
      const data = await apiClient.getMyDashboard({ period: this.period })
      runInAction(() => {
        this.dashboard = data
        this.isLoading = false
      })
    } catch {
      runInAction(() => {
        this.dashboard = null
        this.error = 'Не удалось загрузить данные. Попробуйте позже.'
        this.isLoading = false
      })
    }
  }
}

export const ownerDashboardStore = new OwnerDashboardStore()
