import { Api, HttpClient } from './generated/Api';
import { axiosInstance } from './axios-instance';
import type {
  LoginDto,
  RefreshDto,
  LoginResponseDto,
  TokenPairResponseDto,
  MessageResponseDto,
  AuthUserDto,
} from './generated/Api';

/**
 * API клиент с явными типами возвращаемых значений
 * Использует наш кастомный axios instance
 */
class ApiClient {
  private api: Api<unknown>;

  constructor() {
    // Создаём HttpClient с нашим axios instance
    const httpClient = new HttpClient();
    // Заменяем внутренний axios instance на наш
    httpClient.instance = axiosInstance;
    this.api = new Api(httpClient);
  }

  /**
   * Вход в систему
   */
  login(data: LoginDto): Promise<LoginResponseDto> {
    return this.api.auth.authControllerLogin(data);
  }

  /**
   * Обновление токенов
   */
  refresh(data: RefreshDto): Promise<TokenPairResponseDto> {
    return this.api.auth.authControllerRefresh(data);
  }

  /**
   * Выход из системы
   */
  logout(): Promise<MessageResponseDto> {
    return this.api.auth.authControllerLogout();
  }

  /**
   * Получить текущего пользователя
   */
  getMe(): Promise<AuthUserDto> {
    return this.api.auth.authControllerGetMe();
  }
}

export const apiClient = new ApiClient();

