import type { AuthUserDtoRoleEnum } from '@/api/generated/Api'

/** Базовый префикс кабинета в URL для роли пользователя */
export type CabinetBasePath = '/admin' | '/manager' | '/owner'

export function getCabinetBasePath(role: AuthUserDtoRoleEnum): CabinetBasePath {
  switch (role) {
    case 'ADMIN':
      return '/admin'
    case 'MANAGER':
      return '/manager'
    case 'OWNER':
      return '/owner'
    default: {
      const _exhaustive: never = role
      return _exhaustive
    }
  }
}
