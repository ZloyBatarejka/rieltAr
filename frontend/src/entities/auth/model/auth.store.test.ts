import { describe, it, expect, beforeEach, vi } from 'vitest'
import { AuthStore, type AuthApi, type AuthStatus } from './auth.store'
import type {
  AuthUserDto,
  LoginResponseDto,
  TokenPairResponseDto,
} from '../../../api/generated/Api'

const UNAUTHENTICATED: AuthStatus = 'unauthenticated'
const AUTHENTICATED: AuthStatus = 'authenticated'
import { AxiosError, AxiosHeaders } from 'axios'

// ─── Helpers ─────────────────────────────────────────────

function createAxiosError(message: string): AxiosError<{ message: string }> {
  return new AxiosError('fail', '401', undefined, undefined, {
    data: { message },
    status: 401,
    statusText: 'Unauthorized',
    headers: new AxiosHeaders(),
    config: { headers: new AxiosHeaders() },
  })
}

// ─── Fixtures ────────────────────────────────────────────

const managerUser: AuthUserDto = {
  id: '1',
  email: 'manager@test.com',
  name: 'Test Manager',
  role: 'MANAGER',
  ownerId: null,
}

const ownerUser: AuthUserDto = {
  id: '2',
  email: 'owner@test.com',
  name: 'Test Owner',
  role: 'OWNER',
  ownerId: null,
}

const loginResponse: LoginResponseDto = {
  accessToken: 'access-123',
  refreshToken: 'refresh-123',
  user: managerUser,
}

const tokenPair: TokenPairResponseDto = {
  accessToken: 'new-access',
  refreshToken: 'new-refresh',
}

// ─── Mock API factory ────────────────────────────────────

function createMockApi(overrides?: Partial<AuthApi>): AuthApi {
  return {
    login: vi.fn<AuthApi['login']>().mockResolvedValue(loginResponse),
    refresh: vi.fn<AuthApi['refresh']>().mockResolvedValue(tokenPair),
    logout: vi.fn<AuthApi['logout']>().mockResolvedValue({ message: 'ok' }),
    getMe: vi.fn<AuthApi['getMe']>().mockResolvedValue(managerUser),
    ...overrides,
  }
}

// ─── Tests ───────────────────────────────────────────────

describe('AuthStore', () => {
  let store: AuthStore
  let api: AuthApi

  beforeEach(() => {
    localStorage.clear()
    api = createMockApi()
    store = new AuthStore(api)
  })

  // ── login ──────────────────────────────────────────────

  describe('login', () => {
    it('sets authenticated state and stores tokens on success', async () => {
      await store.login('manager@test.com', 'password123')

      expect(store.status).toBe(AUTHENTICATED)
      expect(store.user).toEqual(managerUser)
      expect(store.error).toBeNull()
      expect(localStorage.getItem('accessToken')).toBe('access-123')
      expect(localStorage.getItem('refreshToken')).toBe('refresh-123')
    })

    it('sets error and unauthenticated on API failure', async () => {
      const error = createAxiosError('Неверный пароль')

      api = createMockApi({ login: vi.fn().mockRejectedValue(error) })
      store = new AuthStore(api)

      await store.login('bad@test.com', 'wrong')

      expect(store.status).toBe(UNAUTHENTICATED)
      expect(store.error).toBe(error.response?.data.message)
      expect(store.user).toBeNull()
    })

    it('uses fallback error message for non-axios errors', async () => {
      api = createMockApi({
        login: vi.fn().mockRejectedValue(new Error('network')),
      })
      store = new AuthStore(api)

      await store.login('a@b.com', '123456')

      expect(store.error).toBe('Произошла ошибка. Попробуйте позже.')
    })
  })

  // ── logout ─────────────────────────────────────────────

  describe('logout', () => {
    it('clears user, tokens and status', async () => {
      await store.login('manager@test.com', 'password123')
      await store.logout()

      expect(store.user).toBeNull()
      expect(store.status).toBe(UNAUTHENTICATED)
      expect(store.error).toBeNull()
      expect(localStorage.getItem('accessToken')).toBeNull()
      expect(localStorage.getItem('refreshToken')).toBeNull()
    })

    it('clears local state even if API call fails', async () => {
      api = createMockApi({
        logout: vi.fn().mockRejectedValue(new Error('500')),
      })
      store = new AuthStore(api)

      await store.login('manager@test.com', 'password123')
      await store.logout()

      expect(store.user).toBeNull()
      expect(store.status).toBe(UNAUTHENTICATED)
      expect(localStorage.getItem('accessToken')).toBeNull()
    })
  })

  // ── refresh ────────────────────────────────────────────

  describe('refresh', () => {
    it('returns true and updates tokens on success', async () => {
      localStorage.setItem('refreshToken', 'old-refresh')

      const result = await store.refresh()

      expect(result).toBe(true)
      expect(localStorage.getItem('accessToken')).toBe('new-access')
      expect(localStorage.getItem('refreshToken')).toBe('new-refresh')
    })

    it('returns false and sets unauthenticated when no refresh token', async () => {
      const result = await store.refresh()

      expect(result).toBe(false)
      expect(store.status).toBe(UNAUTHENTICATED)
    })

    it('returns false and clears tokens on API failure', async () => {
      localStorage.setItem('refreshToken', 'expired-token')
      api = createMockApi({
        refresh: vi.fn().mockRejectedValue(new Error('401')),
      })
      store = new AuthStore(api)

      const result = await store.refresh()

      expect(result).toBe(false)
      expect(store.status).toBe(UNAUTHENTICATED)
      expect(localStorage.getItem('refreshToken')).toBeNull()
    })
  })

  // ── initialize ─────────────────────────────────────────

  describe('initialize', () => {
    it('refreshes tokens and loads user on success', async () => {
      localStorage.setItem('refreshToken', 'existing-token')

      await store.initialize()

      expect(api.refresh).toHaveBeenCalled()
      expect(api.getMe).toHaveBeenCalled()
      expect(store.status).toBe(AUTHENTICATED)
      expect(store.user).toEqual(managerUser)
    })

    it('does not run twice (initialized flag)', async () => {
      localStorage.setItem('refreshToken', 'existing-token')

      await store.initialize()
      await store.initialize()

      expect(api.refresh).toHaveBeenCalledTimes(1)
      expect(api.getMe).toHaveBeenCalledTimes(1)
    })

    it('sets unauthenticated when no refresh token exists', async () => {
      await store.initialize()

      expect(store.status).toBe(UNAUTHENTICATED)
      expect(api.refresh).not.toHaveBeenCalled()
    })
  })

  // ── computed ───────────────────────────────────────────

  describe('computed properties', () => {
    it('isManager returns true for MANAGER role', async () => {
      await store.login('manager@test.com', 'password123')

      expect(store.isManager).toBe(true)
      expect(store.isOwner).toBe(false)
    })

    it('isOwner returns true for OWNER role', async () => {
      api = createMockApi({
        login: vi.fn<AuthApi['login']>().mockResolvedValue({
          ...loginResponse,
          user: ownerUser,
        }),
      })
      store = new AuthStore(api)

      await store.login('owner@test.com', 'password123')

      expect(store.isOwner).toBe(true)
      expect(store.isManager).toBe(false)
    })

    it('isAuthenticated requires both status and user', () => {
      expect(store.isAuthenticated).toBe(false)
    })

    it('isLoading is true for idle and loading statuses', () => {
      expect(store.isLoading).toBe(true)

      store.status = 'loading'
      expect(store.isLoading).toBe(true)
    })
  })

  // ── clearError ─────────────────────────────────────────

  describe('clearError', () => {
    it('resets error to null', async () => {
      api = createMockApi({
        login: vi.fn().mockRejectedValue(new Error('fail')),
      })
      store = new AuthStore(api)

      await store.login('a@b.com', '123456')
      expect(store.error).not.toBeNull()

      store.clearError()
      expect(store.error).toBeNull()
    })
  })
})
