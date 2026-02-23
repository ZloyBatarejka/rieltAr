import { type ReactElement } from 'react'
import { observer } from 'mobx-react-lite'
import { Text } from '@chakra-ui/react'
import { authStore } from '../../entities/auth'
import { DashboardLayout } from '../../widgets/dashboard-layout'

const OwnerDashboardPage = observer(
  function OwnerDashboardPage(): ReactElement {
    return (
      <DashboardLayout title="Кабинет собственника">
        <Text>
          Добро пожаловать, {authStore.user?.name ?? 'Собственник'}! Здесь будет
          ваш личный кабинет.
        </Text>
      </DashboardLayout>
    )
  },
)

export default OwnerDashboardPage
