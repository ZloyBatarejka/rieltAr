import {
  type PropsWithChildren,
  type ReactElement,
} from 'react'
import { Heading } from '@chakra-ui/react'
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
        <Heading size="md" className={styles.title}>{title}</Heading>
        <LogoutButton />
      </div>
      {children}
    </div>
  )
}
