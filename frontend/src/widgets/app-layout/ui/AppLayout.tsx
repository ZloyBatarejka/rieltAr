import { type ReactElement, useState, useCallback } from 'react'
import { Outlet } from 'react-router-dom'
import { IconButton, Heading } from '@chakra-ui/react'
import { HamburgerIcon } from '@chakra-ui/icons'
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
        <IconButton
          aria-label="Открыть меню"
          icon={<HamburgerIcon />}
          variant="ghost"
          size="sm"
          onClick={handleOpen}
        />
        <Heading size="sm" className={styles.topBarTitle}>
          {title}
        </Heading>
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
