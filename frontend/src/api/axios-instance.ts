import axios, {
  type AxiosError,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8070'
console.log('API_URL23232323', API_URL, import.meta.env.VITE_API_URL)
const ACCESS_TOKEN_KEY = 'accessToken'
const REFRESH_TOKEN_KEY = 'refreshToken'

export const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
})

// ─── Request interceptor: подставляем JWT ───────────────

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
)

// ─── Response interceptor: refresh при 401 ──────────────

interface RetryableRequest extends InternalAxiosRequestConfig {
  _retry?: boolean
}

function isRetryableRequest(value: unknown): value is RetryableRequest {
  return typeof value === 'object' && value !== null && 'headers' in value
}

interface RefreshResponse {
  accessToken: string
  refreshToken: string
}

function isRefreshResponse(value: unknown): value is RefreshResponse {
  if (typeof value !== 'object' || value === null) return false
  if (!('accessToken' in value) || !('refreshToken' in value)) return false
  return (
    typeof value.accessToken === 'string' &&
    typeof value.refreshToken === 'string'
  )
}

let isRefreshing = false
let pendingRequests: Array<(token: string) => void> = []

function processPendingRequests(token: string): void {
  pendingRequests.forEach((cb) => cb(token))
  pendingRequests = []
}

function rejectPendingRequests(): void {
  pendingRequests = []
}

axiosInstance.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => response,
  async (error: AxiosError): Promise<AxiosResponse> => {
    const originalRequest = isRetryableRequest(error.config)
      ? error.config
      : undefined

    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry
    ) {
      return Promise.reject(error)
    }

    originalRequest._retry = true

    if (isRefreshing) {
      return new Promise<AxiosResponse>((resolve, reject) => {
        pendingRequests.push((token: string) => {
          originalRequest.headers.Authorization = `Bearer ${token}`
          axiosInstance.request(originalRequest).then(resolve).catch(reject)
        })
      })
    }

    isRefreshing = true

    try {
      const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY)
      if (!refreshToken) {
        return Promise.reject(error)
      }

      // Прямой axios.post — без interceptors, без цикла
      const response: AxiosResponse<unknown> = await axios.post(
        `${API_URL}/auth/refresh`,
        {
          refreshToken,
        },
      )

      if (!isRefreshResponse(response.data)) {
        localStorage.removeItem(ACCESS_TOKEN_KEY)
        localStorage.removeItem(REFRESH_TOKEN_KEY)
        return Promise.reject(error)
      }

      localStorage.setItem(ACCESS_TOKEN_KEY, response.data.accessToken)
      localStorage.setItem(REFRESH_TOKEN_KEY, response.data.refreshToken)

      originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`
      processPendingRequests(response.data.accessToken)
      return axiosInstance.request(originalRequest)
    } catch {
      localStorage.removeItem(ACCESS_TOKEN_KEY)
      localStorage.removeItem(REFRESH_TOKEN_KEY)
      rejectPendingRequests()
      return Promise.reject(error)
    } finally {
      isRefreshing = false
    }
  },
)
