import { type ReactElement } from 'react'
import { observer } from 'mobx-react-lite'
import { Text } from '@consta/uikit/Text'
import { authStore } from '../../entities/auth'

const ManagerDashboardPage = observer(
  function ManagerDashboardPage(): ReactElement {
    return (
      <>
        <Text size="2xl" weight="bold" as="h1" view="primary">Дашборд</Text>
        <Text view="secondary">
          Добро пожаловать, {authStore.user?.name ?? 'Менеджер'}! Здесь будет
          панель управления.
        </Text>
      </>
    )
  },
)

export default ManagerDashboardPage
