import { type ReactElement, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { authStore } from './entities/auth'
import { GuardedRoute } from './features/auth'
import LoginPage from './pages/login/LoginPage'
import ManagerDashboardPage from './pages/manager/ManagerDashboardPage'
import OwnerDashboardPage from './pages/owner/OwnerDashboardPage'
import { ChakraProvider } from './providers'

const AppContent = observer(function AppContent(): ReactElement {
  useEffect(() => {
    void authStore.checkAuth()
  }, [])

  return (
    <ChakraProvider>
      <Routes>
        <Route element={<GuardedRoute mode="guest" />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>

        <Route element={<GuardedRoute mode="private" requiredRole="MANAGER" />}>
          <Route path="/manager" element={<ManagerDashboardPage />} />
        </Route>

        <Route element={<GuardedRoute mode="private" requiredRole="OWNER" />}>
          <Route path="/owner" element={<OwnerDashboardPage />} />
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
