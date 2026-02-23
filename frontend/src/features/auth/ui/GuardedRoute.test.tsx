import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { ChakraProvider as ChakraProviderOriginal } from '@chakra-ui/react'
import { AuthStore, type AuthApi } from '../../../entities/auth'
import type { AuthUserDtoRoleEnum } from '../../../api/generated/Api'

const managerUser = {
  id: '1',
  email: 'manager@test.com',
  name: 'Test Manager',
  role: 'MANAGER' as const,
  ownerId: null,
  canCreateOwners: false,
  canCreateProperties: false,
}

const ownerUser = {
  id: '2',
  email: 'owner@test.com',
  name: 'Test Owner',
  role: 'OWNER' as const,
  ownerId: null,
  canCreateOwners: false,
  canCreateProperties: false,
}

function createMockApi(): AuthApi {
  return {
    login: vi.fn().mockResolvedValue({ accessToken: '', refreshToken: '', user: managerUser }),
    refresh: vi.fn().mockResolvedValue({ accessToken: '', refreshToken: '' }),
    logout: vi.fn().mockResolvedValue({ message: 'ok' }),
    getMe: vi.fn().mockResolvedValue(managerUser),
  }
}

let testStore: AuthStore

vi.mock('../../../entities/auth', async () => {
  const actual = await vi.importActual<typeof import('../../../entities/auth')>('../../../entities/auth')
  return {
    ...actual,
    get authStore(): AuthStore {
      return testStore
    },
  }
})

interface RenderGuardedRouteOptions {
  mode: 'private' | 'guest'
  requiredRole?: AuthUserDtoRoleEnum
  initialPath?: string
}

async function renderGuardedRoute({
  mode,
  requiredRole,
  initialPath = '/protected',
}: RenderGuardedRouteOptions): Promise<void> {
  const { default: GuardedRoute } = await import('./GuardedRoute')

  render(
    <MemoryRouter initialEntries={[initialPath]}>
      <ChakraProviderOriginal>
        <Routes>
          <Route element={<GuardedRoute mode={mode} requiredRole={requiredRole} />}>
            <Route path="/protected" element={<div>Protected Content</div>} />
          </Route>
          <Route path="/login" element={<div>Login Page</div>} />
          <Route path="/manager" element={<div>Manager Dashboard</div>} />
          <Route path="/owner" element={<div>Owner Dashboard</div>} />
        </Routes>
      </ChakraProviderOriginal>
    </MemoryRouter>,
  )
}

describe('GuardedRoute', () => {
  beforeEach(() => {
    localStorage.clear()
    testStore = new AuthStore(createMockApi())
    vi.clearAllMocks()
  })

  describe('mode="private"', () => {
    it('redirects to /login when not authenticated', async () => {
      testStore.status = 'unauthenticated'

      await renderGuardedRoute({ mode: 'private' })

      expect(screen.getByText('Login Page')).toBeInTheDocument()
    })

    it('renders child content when authenticated with matching role', async () => {
      testStore.status = 'authenticated'
      testStore.user = managerUser

      await renderGuardedRoute({ mode: 'private', requiredRole: 'MANAGER' })

      expect(screen.getByText('Protected Content')).toBeInTheDocument()
    })

    it('redirects to role dashboard when role does not match', async () => {
      testStore.status = 'authenticated'
      testStore.user = ownerUser

      await renderGuardedRoute({ mode: 'private', requiredRole: 'MANAGER' })

      expect(screen.getByText('Owner Dashboard')).toBeInTheDocument()
    })
  })

  describe('mode="guest"', () => {
    it('renders child content when not authenticated', async () => {
      testStore.status = 'unauthenticated'

      await renderGuardedRoute({ mode: 'guest' })

      expect(screen.getByText('Protected Content')).toBeInTheDocument()
    })

    it('redirects manager to /manager when authenticated', async () => {
      testStore.status = 'authenticated'
      testStore.user = managerUser

      await renderGuardedRoute({ mode: 'guest' })

      expect(screen.getByText('Manager Dashboard')).toBeInTheDocument()
    })

    it('redirects owner to /owner when authenticated', async () => {
      testStore.status = 'authenticated'
      testStore.user = ownerUser

      await renderGuardedRoute({ mode: 'guest' })

      expect(screen.getByText('Owner Dashboard')).toBeInTheDocument()
    })
  })

  describe('loading', () => {
    it('renders spinner while loading', async () => {
      testStore.status = 'loading'

      await renderGuardedRoute({ mode: 'private' })

      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()
      expect(screen.queryByText('Login Page')).not.toBeInTheDocument()
    })
  })
})
