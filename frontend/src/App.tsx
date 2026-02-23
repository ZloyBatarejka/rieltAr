import { type ReactElement, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { authStore } from './entities/auth'
import { GuardedRoute } from './features/auth'
import LoginPage from './pages/login/LoginPage'
import ManagerDashboardPage from './pages/manager/ManagerDashboardPage'
import OwnerDashboardPage from './pages/owner/OwnerDashboardPage'
import { ManagerLayout } from './widgets/manager-layout'
import { OwnerLayout } from './widgets/owner-layout'
import { ChakraProvider } from './providers'

const AppContent = observer(function AppContent(): ReactElement {
  useEffect(() => {
    void authStore.initialize()
  }, [])

  return (
    <ChakraProvider>
      <Routes>
        <Route element={<GuardedRoute mode="guest" />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>

        <Route element={<GuardedRoute mode="private" requiredRole="MANAGER" />}>
          <Route path="/manager" element={<ManagerLayout />}>
            <Route index element={<ManagerDashboardPage />} />
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
    </ChakraProvider>
  )
})

const RootRedirect = observer(function RootRedirect(): ReactElement {
  if (authStore.isAuthenticated) {
    const path = authStore.isManager ? '/manager' : '/owner'
    return <Navigate to={path} replace />
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
