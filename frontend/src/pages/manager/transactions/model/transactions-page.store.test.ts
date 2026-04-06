import { describe, it, expect, beforeEach, vi } from 'vitest'
import { runInAction } from 'mobx'
import { transactionsPageStore } from './transactions-page.store'
import { apiClient } from '@/api/api-client'

vi.mock('@/api/api-client', () => ({
  apiClient: {
    getTransactions: vi.fn(),
    getOwners: vi.fn(),
    getProperties: vi.fn(),
    createTransaction: vi.fn(),
  },
}))

describe('TransactionsPageStore — запрос списка с фильтрами', () => {
  beforeEach(() => {
    vi.mocked(apiClient.getTransactions).mockResolvedValue({
      items: [],
      total: 0,
    })
    runInAction(() => {
      transactionsPageStore.filterOwnerId = null
      transactionsPageStore.filterPropertyId = null
      transactionsPageStore.filterType = null
      transactionsPageStore.periodFrom = null
      transactionsPageStore.periodTo = null
      transactionsPageStore.transactions = []
      transactionsPageStore.total = 0
      transactionsPageStore.isLoading = false
    })
    vi.clearAllMocks()
  })

  it('передаёт в API пустой набор параметров без фильтров', async () => {
    await transactionsPageStore.fetchTransactions()

    expect(apiClient.getTransactions).toHaveBeenCalledWith({})
  })

  it('передаёт ownerId, propertyId и type в запрос', async () => {
    runInAction(() => {
      transactionsPageStore.filterOwnerId = 'owner-1'
      transactionsPageStore.filterPropertyId = 'prop-1'
      transactionsPageStore.filterType = 'INCOME'
    })

    await transactionsPageStore.fetchTransactions()

    expect(apiClient.getTransactions).toHaveBeenCalledWith({
      ownerId: 'owner-1',
      propertyId: 'prop-1',
      type: 'INCOME',
    })
  })

  it('передаёт from/to в ISO для выбранного периода', async () => {
    const from = new Date(2026, 2, 1, 15, 30)
    const to = new Date(2026, 2, 15, 10, 0)
    runInAction(() => {
      transactionsPageStore.periodFrom = from
      transactionsPageStore.periodTo = to
    })

    await transactionsPageStore.fetchTransactions()

    expect(apiClient.getTransactions).toHaveBeenCalledWith({
      from: new Date(2026, 2, 1, 0, 0, 0, 0).toISOString(),
      to: new Date(2026, 2, 15, 23, 59, 59, 999).toISOString(),
    })
  })

  it('resetFilters сбрасывает фильтры и запрашивает список без параметров', async () => {
    runInAction(() => {
      transactionsPageStore.filterOwnerId = 'x'
      transactionsPageStore.filterPropertyId = 'y'
      transactionsPageStore.filterType = 'EXPENSE'
    })

    await transactionsPageStore.resetFilters()

    expect(transactionsPageStore.filterOwnerId).toBeNull()
    expect(transactionsPageStore.filterPropertyId).toBeNull()
    expect(transactionsPageStore.filterType).toBeNull()
    expect(apiClient.getTransactions).toHaveBeenCalledWith({})
  })
})
