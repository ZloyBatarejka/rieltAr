import type { AuthUserDto } from '@/api/generated/Api'

/** ID профиля собственника в БД (роль OWNER). */
export function getOwnerProfileId(user: AuthUserDto | null): string | undefined {
  if (user === null || user.role !== 'OWNER') {
    return undefined
  }
  const raw = user.ownerId
  if (raw === null) {
    return undefined
  }
  if (typeof raw === 'string') {
    return raw
  }
  return undefined
}
