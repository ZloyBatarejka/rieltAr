import { describe, expect, it } from 'vitest'
import type { AuthUserDto } from '@/api/generated/Api'
import { getOwnerProfileId } from './get-owner-profile-id'

function makeUser(partial: Partial<AuthUserDto>): AuthUserDto {
  return {
    id: 'u1',
    email: 'o@x.ru',
    name: 'Owner',
    role: 'OWNER',
    ownerId: null,
    canCreateOwners: false,
    canCreateProperties: false,
    ...partial,
  }
}

describe('getOwnerProfileId', () => {
  it('returns undefined for null user', () => {
    expect(getOwnerProfileId(null)).toBeUndefined()
  })

  it('returns undefined for non-owner role', () => {
    expect(getOwnerProfileId(makeUser({ role: 'MANAGER' }))).toBeUndefined()
  })

  it('returns undefined when ownerId is null', () => {
    expect(getOwnerProfileId(makeUser({ ownerId: null }))).toBeUndefined()
  })

  it('returns string owner id for owner with profile', () => {
    const id = '550e8400-e29b-41d4-a716-446655440001'
    const user = makeUser({})
    Object.assign(user, { ownerId: id })
    expect(getOwnerProfileId(user)).toBe(id)
  })
})
