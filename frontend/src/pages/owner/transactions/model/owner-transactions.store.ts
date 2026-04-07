import { makeAutoObservable, runInAction } from 'mobx'
import { apiClient } from '@/api/api-client'
import type { Property, Transaction, TransactionType } from '@/shared/types'
import type { TransactionsControllerFindAllParams } from '@/api/generated/Api'

function startOfDayIso(d: Date): string {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0).toISOString()
}

function endOfDayIso(d: Date): string {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999).toISOString()
}

class OwnerTransactionsStore {
  properties: Property[] = []
  transactions: Transaction[] = []
  total = 0

  isLoading = true
  error: string | null = null

  filterPropertyId: string | null = null
  filterType: TransactionType | null = null
  periodFrom: Date | null = null
  periodTo: Date | null = null

  constructor() {
    makeAutoObservable(this)
  }

  setFilterPropertyId(value: string | null): void {
    this.filterPropertyId = value
  }

  setFilterType(value: TransactionType | null): void {
    this.filterType = value
  }

  setPeriodFrom(value: Date | null): void {
    this.periodFrom = value
  }

  setPeriodTo(value: Date | null): void {
    this.periodTo = value
  }

  private buildQuery(): TransactionsControllerFindAllParams {
    const params: TransactionsControllerFindAllParams = {}
    params.propertyId = this.filterPropertyId ?? undefined
    params.type = this.filterType ?? undefined
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

  async fetchTransactions(): Promise<void> {
    this.isLoading = true
    this.error = null
    try {
      const data = await apiClient.getTransactions(this.buildQuery())
      runInAction(() => {
        this.transactions = data.items
        this.total = data.total
      })
    } catch {
      runInAction(() => {
        this.transactions = []
        this.total = 0
        this.error = 'Не удалось загрузить операции.'
      })
    } finally {
      runInAction(() => {
        this.isLoading = false
      })
    }
  }

  async applyFilters(): Promise<void> {
    await this.fetchTransactions()
  }

  async resetFilters(): Promise<void> {
    runInAction(() => {
      this.filterPropertyId = null
      this.filterType = null
      this.periodFrom = null
      this.periodTo = null
    })
    await this.fetchTransactions()
  }
}

export const ownerTransactionsStore = new OwnerTransactionsStore()

