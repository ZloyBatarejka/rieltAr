import { describe, it, expect } from 'vitest'
import { TRANSACTION_TYPES } from '@/shared/types'
import { TYPE_FILTER_ITEMS } from './filters'

describe('transactions TYPE_FILTER_ITEMS', () => {
  it('covers all transaction types with labels', () => {
    expect(TYPE_FILTER_ITEMS).toHaveLength(TRANSACTION_TYPES.length)
    const ids = new Set(TYPE_FILTER_ITEMS.map((i) => i.id))
    for (const t of TRANSACTION_TYPES) {
      expect(ids.has(t)).toBe(true)
    }
  })

  it('has non-empty label for each item', () => {
    for (const item of TYPE_FILTER_ITEMS) {
      expect(item.label.length).toBeGreaterThan(0)
    }
  })
})
