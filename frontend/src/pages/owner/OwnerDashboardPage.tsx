import { type ReactElement } from 'react'
import { observer } from 'mobx-react-lite'
import { Heading, Text } from '@chakra-ui/react'
import { authStore } from '../../entities/auth'

const OwnerDashboardPage = observer(
  function OwnerDashboardPage(): ReactElement {
    return (
      <>
        <Heading size="lg" mb={4}>Дашборд</Heading>
        <Text>
          Добро пожаловать, {authStore.user?.name ?? 'Собственник'}! Здесь будет
          ваш личный кабинет.
        </Text>
      </>
    )
  },
)

export default OwnerDashboardPage
