import { type ReactElement } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { Spinner } from '@chakra-ui/react'
import { authStore } from '../../../entities/auth'
import type { AuthUserDtoRoleEnum } from '../../../api/generated/Api'
import styles from './GuardedRoute.module.css'

interface GuardedRouteProps {
  mode: 'private' | 'guest'
  requiredRole?: AuthUserDtoRoleEnum
}

const GuardedRoute = observer(function GuardedRoute({
  mode,
  requiredRole,
}: GuardedRouteProps): ReactElement {
  const redirectPath = authStore.isManager ? '/manager' : '/owner'

  if (authStore.isLoading) {
    return (
      <div className={styles.spinnerWrapper}>
        <Spinner size="xl" />
      </div>
    )
  }

  if (mode === 'guest') {
    return authStore.isAuthenticated ? (
      <Navigate to={redirectPath} replace />
    ) : (
      <Outlet />
    )
  }

  if (!authStore.isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (requiredRole && authStore.user?.role !== requiredRole) {
    return <Navigate to={redirectPath} replace />
  }

  return <Outlet />
})

export default GuardedRoute
