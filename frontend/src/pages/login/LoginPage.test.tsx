import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { ChakraProvider as ChakraProviderOriginal } from '@chakra-ui/react'
import { AuthStore, type AuthApi } from '../../entities/auth'
import type { LoginResponseDto } from '../../api/generated/Api'

const managerUser = {
  id: '1',
  email: 'manager@test.com',
  name: 'Test Manager',
  role: 'MANAGER' as const,
  ownerId: null,
}

const loginResponse: LoginResponseDto = {
  accessToken: 'access-123',
  refreshToken: 'refresh-123',
  user: managerUser,
}

function createMockApi(overrides?: Partial<AuthApi>): AuthApi {
  return {
    login: vi.fn<AuthApi['login']>().mockResolvedValue(loginResponse),
    refresh: vi
      .fn<AuthApi['refresh']>()
      .mockResolvedValue({ accessToken: 'a', refreshToken: 'r' }),
    logout: vi.fn<AuthApi['logout']>().mockResolvedValue({ message: 'ok' }),
    getMe: vi.fn<AuthApi['getMe']>().mockResolvedValue(managerUser),
    ...overrides,
  }
}

let testStore: AuthStore

vi.mock('../../entities/auth', async () => {
  const actual = await vi.importActual<typeof import('../../entities/auth')>(
    '../../entities/auth',
  )
  return {
    ...actual,
    get authStore(): AuthStore {
      return testStore
    },
  }
})

async function renderLoginPage(): Promise<ReturnType<typeof userEvent.setup>> {
  const user = userEvent.setup()
  const { default: LoginPage } = await import('./LoginPage')

  render(
    <MemoryRouter>
      <ChakraProviderOriginal>
        <LoginPage />
      </ChakraProviderOriginal>
    </MemoryRouter>,
  )

  return user
}

describe('LoginPage', () => {
  let api: AuthApi

  beforeEach(() => {
    localStorage.clear()
    api = createMockApi()
    testStore = new AuthStore(api)
    vi.clearAllMocks()
  })

  it('renders email, password fields and submit button', async () => {
    await renderLoginPage()

    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Пароль')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Войти' })).toBeInTheDocument()
  })

  it('submit button is disabled when fields are empty', async () => {
    await renderLoginPage()

    expect(screen.getByRole('button', { name: 'Войти' })).toBeDisabled()
  })

  it('shows validation error for invalid email', async () => {
    const user = await renderLoginPage()

    await user.type(screen.getByPlaceholderText('Email'), 'not-an-email')
    await user.type(screen.getByPlaceholderText('Пароль'), 'password123')

    await waitFor(() => {
      expect(screen.getByText('Некорректный email')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Войти' })).toBeDisabled()
    })
  })

  it('shows validation error for short password', async () => {
    const user = await renderLoginPage()

    await user.type(screen.getByPlaceholderText('Email'), 'test@test.com')
    await user.type(screen.getByPlaceholderText('Пароль'), '12345')

    await waitFor(() => {
      expect(screen.getByText('Минимум 6 символов')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Войти' })).toBeDisabled()
    })
  })

  it('calls authStore.login on valid submit', async () => {
    const user = await renderLoginPage()

    await user.type(screen.getByPlaceholderText('Email'), 'test@test.com')
    await user.type(screen.getByPlaceholderText('Пароль'), 'password123')

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Войти' })).toBeEnabled()
    })

    await user.click(screen.getByRole('button', { name: 'Войти' }))

    await waitFor(() => {
      expect(api.login).toHaveBeenCalledWith({
        email: 'test@test.com',
        password: 'password123',
      })
    })
  })

  it('displays server error from authStore', async () => {
    testStore.error = 'Неверный пароль'
    await renderLoginPage()

    expect(screen.getByText('Неверный пароль')).toBeInTheDocument()
  })

  it('toggles password visibility', async () => {
    const user = await renderLoginPage()
    const passwordInput = screen.getByPlaceholderText('Пароль')

    expect(passwordInput).toHaveAttribute('type', 'password')

    const toggleButton = screen.getByLabelText('Показать пароль')
    await user.click(toggleButton)

    expect(passwordInput).toHaveAttribute('type', 'text')
  })
})
