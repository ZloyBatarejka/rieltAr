import { type ReactElement } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { Loader } from '@consta/uikit/Loader'
import { authStore } from '../../../entities/auth'
import type { AuthUserDtoRoleEnum } from '../../../api/generated/Api'
import styles from './GuardedRoute.module.css'

interface GuardedRouteProps {
  mode: 'private' | 'guest'
  requiredRole?: AuthUserDtoRoleEnum
}

function getHomePath(): string {
  if (authStore.isAdmin) return '/admin'
  if (authStore.isManager) return '/manager'
  return '/owner'
}

const GuardedRoute = observer(function GuardedRoute({
  mode,
  requiredRole,
}: GuardedRouteProps): ReactElement {
  if (authStore.isLoading) {
    return (
      <div className={styles.spinnerWrapper}>
        <Loader size="m" />
      </div>
    )
  }

  const homePath = getHomePath()

  if (mode === 'guest') {
    return authStore.isAuthenticated ? (
      <Navigate to={homePath} replace />
    ) : (
      <Outlet />
    )
  }

  if (!authStore.isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (requiredRole && authStore.user?.role !== requiredRole) {
    return <Navigate to={homePath} replace />
  }

  return <Outlet />
})

export default GuardedRoute
