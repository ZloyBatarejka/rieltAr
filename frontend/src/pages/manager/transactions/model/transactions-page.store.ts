import { makeAutoObservable, runInAction } from 'mobx'
import { apiClient } from '@/api/api-client'
import type {
  CreateTransaction,
  Owner,
  Property,
  Transaction,
  TransactionType,
} from '@/shared/types'
import type { TransactionsControllerFindAllParams } from '@/api/generated/Api'

function startOfDayIso(d: Date): string {
  return new Date(
    d.getFullYear(),
    d.getMonth(),
    d.getDate(),
    0,
    0,
    0,
    0,
  ).toISOString()
}

function endOfDayIso(d: Date): string {
  return new Date(
    d.getFullYear(),
    d.getMonth(),
    d.getDate(),
    23,
    59,
    59,
    999,
  ).toISOString()
}

class TransactionsPageStore {
  owners: Owner[] = []
  properties: Property[] = []
  transactions: Transaction[] = []
  total = 0

  isLoading = true
  isSubmitting = false

  filterOwnerId: Nullable<string> = null
  filterPropertyId: Nullable<string> = null
  filterType: TransactionType | null = null
  periodFrom: Nullable<Date> = null
  periodTo: Nullable<Date> = null

  constructor() {
    makeAutoObservable(this)
  }

  setFilterOwnerId(value: Nullable<string>): void {
    this.filterOwnerId = value
  }

  setFilterPropertyId(value: Nullable<string>): void {
    this.filterPropertyId = value
  }

  setFilterType(value: Nullable<TransactionType>): void {
    this.filterType = value
  }

  setPeriodFrom(value: Nullable<Date>): void {
    this.periodFrom = value
  }

  setPeriodTo(value: Nullable<Date>): void {
    this.periodTo = value
  }

  private buildQuery(): TransactionsControllerFindAllParams {
    const params: TransactionsControllerFindAllParams = {}
    params.ownerId = this.filterOwnerId ?? undefined
    params.propertyId = this.filterPropertyId ?? undefined
    params.type = this.filterType ?? undefined
    params.from = this.periodFrom ? startOfDayIso(this.periodFrom) : undefined
    params.to = this.periodTo ? endOfDayIso(this.periodTo) : undefined
    return params
  }

  async fetchDictionaries(): Promise<void> {
    try {
      const [ownersData, propertiesData] = await Promise.all([
        apiClient.getOwners(),
        apiClient.getProperties(),
      ])
      runInAction(() => {
        this.owners = ownersData.items
        this.properties = propertiesData.items
      })
    } catch {
      // ошибка — без тоста
    }
  }

  async fetchTransactions(): Promise<void> {
    this.isLoading = true
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
      this.filterOwnerId = null
      this.filterPropertyId = null
      this.filterType = null
      this.periodFrom = null
      this.periodTo = null
    })
    await this.fetchTransactions()
  }

  async createTransaction(data: CreateTransaction): Promise<boolean> {
    this.isSubmitting = true
    try {
      await apiClient.createTransaction(data)
      await this.fetchTransactions()
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

export const transactionsPageStore = new TransactionsPageStore()
