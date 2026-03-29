import { type ReactElement, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { authStore } from './entities/auth'
import { GuardedRoute } from './features/auth'
import LoginPage from './pages/login/LoginPage'
import AdminDashboardPage from './pages/admin/AdminDashboardPage'
import { AdminManagersPage } from './pages/admin/managers'
import { AdminOwnersPage } from './pages/admin/owners'
import { AdminPropertiesPage } from './pages/admin/properties'
import { AdminAssignmentsPage } from './pages/admin/assignments'
import ManagerDashboardPage from './pages/manager/ManagerDashboardPage'
import { ManagerOwnersPage } from './pages/manager/owners'
import { OwnerDetailPage } from './pages/manager/owner-detail'
import { ManagerPropertiesPage } from './pages/manager/properties'
import { BookingsPage, CreateStayPage } from './pages/manager/bookings'
import OwnerDashboardPage from './pages/owner/OwnerDashboardPage'
import { AdminLayout } from './widgets/admin-layout'
import { ManagerLayout } from './widgets/manager-layout'
import { OwnerLayout } from './widgets/owner-layout'
import { ConstaProvider } from './providers'

const AppContent = observer(function AppContent(): ReactElement {
  useEffect(() => {
    void authStore.initialize()
  }, [])

  return (
    <ConstaProvider>
      <Routes>
        <Route element={<GuardedRoute mode="guest" />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>

        <Route element={<GuardedRoute mode="private" requiredRole="ADMIN" />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboardPage />} />
            <Route path="managers" element={<AdminManagersPage />} />
            <Route path="owners" element={<AdminOwnersPage />} />
            <Route path="properties" element={<AdminPropertiesPage />} />
            <Route path="assignments" element={<AdminAssignmentsPage />} />
          </Route>
        </Route>

        <Route element={<GuardedRoute mode="private" requiredRole="MANAGER" />}>
          <Route path="/manager" element={<ManagerLayout />}>
            <Route index element={<ManagerDashboardPage />} />
            <Route path="owners" element={<ManagerOwnersPage />} />
            <Route path="owners/:id" element={<OwnerDetailPage />} />
            <Route path="properties" element={<ManagerPropertiesPage />} />
            <Route path="bookings" element={<BookingsPage />} />
            <Route path="bookings/create" element={<CreateStayPage />} />
          </Route>
        </Route>

        <Route element={<GuardedRoute mode="private" requiredRole="OWNER" />}>
          <Route path="/owner" element={<OwnerLayout />}>
            <Route index element={<OwnerDashboardPage />} />
          </Route>
        </Route>

        <Route path="/" element={<RootRedirect />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </ConstaProvider>
  )
})

function getAuthenticatedPath(): string {
  if (authStore.isAdmin) return '/admin'
  if (authStore.isManager) return '/manager'
  return '/owner'
}

const RootRedirect = observer(function RootRedirect(): ReactElement {
  if (authStore.isAuthenticated) {
    return <Navigate to={getAuthenticatedPath()} replace />
  }
  return <Navigate to="/login" replace />
})

function App(): ReactElement {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}

export default App
