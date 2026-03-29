import {
  type PropsWithChildren,
  type ReactElement,
} from 'react'
import { Text } from '@consta/uikit/Text'
import { LogoutButton } from '../../../features/auth'
import styles from './DashboardLayout.module.css'

interface DashboardLayoutProps extends PropsWithChildren {
  title: string
}

export function DashboardLayout({
  title,
  children,
}: DashboardLayoutProps): ReactElement {
  return (
    <div className={styles.wrapper}>
      <div className={styles.topBar}>
        <Text as="h1" size="l" weight="bold" view="primary" className={styles.title}>{title}</Text>
        <LogoutButton />
      </div>
      {children}
    </div>
  )
}
