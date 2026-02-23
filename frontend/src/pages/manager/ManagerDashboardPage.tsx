import { type ReactElement } from 'react'
import { observer } from 'mobx-react-lite'
import { Heading, Text } from '@chakra-ui/react'
import { authStore } from '../../entities/auth'

const ManagerDashboardPage = observer(
  function ManagerDashboardPage(): ReactElement {
    return (
      <>
        <Heading size="lg" mb={4}>Дашборд</Heading>
        <Text>
          Добро пожаловать, {authStore.user?.name ?? 'Менеджер'}! Здесь будет
          панель управления.
        </Text>
      </>
    )
  },
)

export default ManagerDashboardPage
