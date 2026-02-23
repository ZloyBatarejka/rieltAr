import { makeAutoObservable, runInAction } from 'mobx'
import { isAxiosError } from 'axios'
import type {
  AuthUserDto,
  LoginResponseDto,
  TokenPairResponseDto,
} from '../../../api/generated/Api'

// ─── Интерфейс API-зависимости ──────────────────────────

export interface AuthApi {
  login(data: { email: string; password: string }): Promise<LoginResponseDto>
  refresh(data: { refreshToken: string }): Promise<TokenPairResponseDto>
  logout(): Promise<unknown>
  getMe(): Promise<AuthUserDto>
}

// ─── Constants ──────────────────────────────────────────

const ACCESS_TOKEN_KEY = 'accessToken'
const REFRESH_TOKEN_KEY = 'refreshToken'

// ─── Types ──────────────────────────────────────────────

type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'unauthenticated'

// ─── Store ──────────────────────────────────────────────

export class AuthStore {
  user: AuthUserDto | null = null
  status: AuthStatus = 'idle'
  error: string | null = null

  private readonly api: AuthApi

  constructor(api: AuthApi) {
    this.api = api
    makeAutoObservable(this)
  }

  // ─── Computed ──────────────────────────────────────────

  get isAuthenticated(): boolean {
    return this.status === 'authenticated' && this.user !== null
  }

  get isLoading(): boolean {
    return this.status === 'loading' || this.status === 'idle'
  }

  get isManager(): boolean {
    return this.user?.role === 'MANAGER'
  }

  get isOwner(): boolean {
    return this.user?.role === 'OWNER'
  }

  // ─── Private helpers ──────────────────────────────────

  private setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
  }

  private clearTokens(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
  }

  // ─── Actions ──────────────────────────────────────────

  async login(email: string, password: string): Promise<void> {
    this.status = 'loading'
    this.error = null

    try {
      const response = await this.api.login({ email, password })
      console.log('response', response)
      runInAction(() => {
        this.user = response.user
        this.setTokens(response.accessToken, response.refreshToken)
        this.status = 'authenticated'
      })
    } catch (err: unknown) {
      runInAction(() => {
        this.status = 'unauthenticated'
        this.error = getErrorMessage(err)
      })
    }
  }

  async logout(): Promise<void> {
    try {
      await this.api.logout()
    } catch {
      // Logout на сервере может не удаться — всё равно чистим локально
    }

    runInAction(() => {
      this.user = null
      this.clearTokens()
      this.status = 'unauthenticated'
      this.error = null
    })
  }

  async refresh(): Promise<boolean> {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY)
    if (!refreshToken) {
      runInAction(() => {
        this.status = 'unauthenticated'
      })
      return false
    }

    try {
      const response = await this.api.refresh({ refreshToken })

      runInAction(() => {
        this.setTokens(response.accessToken, response.refreshToken)
      })

      return true
    } catch {
      runInAction(() => {
        this.user = null
        this.clearTokens()
        this.status = 'unauthenticated'
      })
      return false
    }
  }

  async checkAuth(): Promise<void> {
    this.status = 'loading'

    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY)
    if (!refreshToken) {
      runInAction(() => {
        this.status = 'unauthenticated'
      })
      return
    }

    const refreshed = await this.refresh()
    if (!refreshed) return

    try {
      const user = await this.api.getMe()

      runInAction(() => {
        this.user = user
        this.status = 'authenticated'
      })
    } catch {
      runInAction(() => {
        this.user = null
        this.clearTokens()
        this.status = 'unauthenticated'
      })
    }
  }

  public clearError(): void {
    this.error = null
  }
}

// ─── Helper ─────────────────────────────────────────────

interface ErrorData {
  message: string
}

function isErrorData(value: unknown): value is ErrorData {
  if (typeof value !== 'object' || value === null) return false
  if (!('message' in value)) return false
  return typeof value.message === 'string'
}

function getErrorMessage(err: unknown): string {
  if (isAxiosError<unknown>(err) && isErrorData(err.response?.data)) {
    return err.response.data.message
  }
  return 'Произошла ошибка. Попробуйте позже.'
}
