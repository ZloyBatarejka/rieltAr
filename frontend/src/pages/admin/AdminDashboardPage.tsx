import { type ReactElement } from 'react'
import { Text } from '@consta/uikit/Text'
import styles from './AdminDashboardPage.module.css'

function AdminDashboardPage(): ReactElement {
  return (
    <div className={styles.wrapper}>
      <Text size="2xl" weight="bold" view="primary">
        Панель администратора
      </Text>
      <Text view="secondary">
        Управление менеджерами, собственниками, объектами и назначениями.
      </Text>
    </div>
  )
}

export default AdminDashboardPage
