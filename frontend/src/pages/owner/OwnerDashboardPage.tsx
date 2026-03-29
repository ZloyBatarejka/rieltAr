import { type ReactElement } from 'react'
import { observer } from 'mobx-react-lite'
import { Text } from '@consta/uikit/Text'
import { authStore } from '../../entities/auth'
import styles from './OwnerDashboardPage.module.css'

const OwnerDashboardPage = observer(
  function OwnerDashboardPage(): ReactElement {
    return (
      <div className={styles.wrapper}>
        <Text size="2xl" weight="bold" view="primary">
          Дашборд
        </Text>
        <Text view="secondary">
          Добро пожаловать, {authStore.user?.name ?? 'Собственник'}! Здесь будет
          ваш личный кабинет.
        </Text>
      </div>
    )
  },
)

export default OwnerDashboardPage
