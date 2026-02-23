import { type ReactElement } from 'react'
import { observer } from 'mobx-react-lite'
import { Text } from '@chakra-ui/react'
import { authStore } from '../../entities/auth'
import { DashboardLayout } from '../../widgets/dashboard-layout'

const ManagerDashboardPage = observer(
  function ManagerDashboardPage(): ReactElement {
    return (
      <DashboardLayout title="Панель менеджера">
        <Text>
          Добро пожаловать, {authStore.user?.name ?? 'Менеджер'}! Здесь будет
          панель управления.
        </Text>
      </DashboardLayout>
    )
  },
)

export default ManagerDashboardPage
