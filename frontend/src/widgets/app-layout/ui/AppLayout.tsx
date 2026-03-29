import { type ReactElement, useState, useCallback } from 'react'
import { Outlet } from 'react-router-dom'
import { Button } from '@consta/uikit/Button'
import { Text } from '@consta/uikit/Text'
import { IconHamburger } from '@consta/icons/IconHamburger'
import { Sidebar, type NavItem } from '../../sidebar'
import styles from './AppLayout.module.css'

interface AppLayoutProps {
  title: string
  navItems: NavItem[]
  userName: string
}

export function AppLayout({
  title,
  navItems,
  userName,
}: AppLayoutProps): ReactElement {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleOpen = useCallback((): void => {
    setSidebarOpen(true)
  }, [])

  const handleClose = useCallback((): void => {
    setSidebarOpen(false)
  }, [])

  return (
    <div className={styles.layout}>
      <div className={styles.topBar}>
        <Button
          onlyIcon
          iconLeft={IconHamburger}
          view="clear"
          size="s"
          onClick={handleOpen}
          label="Открыть меню"
        />
        <Text as="h1" size="m" weight="bold" view="primary" className={styles.topBarTitle}>
          {title}
        </Text>
      </div>

      <Sidebar
        title={title}
        navItems={navItems}
        userName={userName}
        isOpen={sidebarOpen}
        onClose={handleClose}
      />

      <main className={styles.content}>
        <Outlet />
      </main>
    </div>
  )
}
