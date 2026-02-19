import axios, { type AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8070/api';

export const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ─── Request interceptor: добавляем JWT токен ────────────────────────
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    // TODO: получить access токен из store (будет реализовано в шаге 2.5)
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: unknown): Promise<never> => {
    return Promise.reject(error);
  },
);

// ─── Response interceptor: обработка 401 и refresh токена ────────────

interface RetryableRequest extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

function isRetryableRequest(value: unknown): value is RetryableRequest {
  return value !== null && typeof value === 'object' && 'headers' in value;
}

axiosInstance.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => response,
  async (error: AxiosError): Promise<never> => {
    const originalRequest = isRetryableRequest(error.config) ? error.config : undefined;

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;

      // TODO: реализовать refresh логику (будет в шаге 2.5)
      // 1. Взять refreshToken из store/localStorage
      // 2. Вызвать /auth/refresh
      // 3. Сохранить новые токены
      // 4. Повторить originalRequest с новым accessToken
    }

    return Promise.reject(error);
  },
);
