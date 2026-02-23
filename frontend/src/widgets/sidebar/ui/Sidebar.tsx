import { type ReactElement } from 'react'
import { NavLink } from 'react-router-dom'
import { Heading } from '@chakra-ui/react'
import { LogoutButton } from '../../../features/auth'
import { ThemeToggle } from '../../../shared/ui/ThemeToggle'
import styles from './Sidebar.module.css'

export interface NavItem {
  to: string
  label: string
}

interface SidebarProps {
  title: string
  navItems: NavItem[]
  userName: string
  isOpen: boolean
  onClose: () => void
}

export function Sidebar({
  title,
  navItems,
  userName,
  isOpen,
  onClose,
}: SidebarProps): ReactElement {
  const sidebarClass = `${styles.sidebar} ${isOpen ? styles.sidebarOpen : ''}`
  const overlayClass = `${styles.overlay} ${isOpen ? styles.overlayVisible : ''}`

  return (
    <>
      <div className={overlayClass} onClick={onClose} role="presentation" />
      <aside className={sidebarClass}>
        <div className={styles.header}>
          <Heading size="md" className={styles.brand}>
            Balivi
          </Heading>
          <span className={styles.role}>{title}</span>
        </div>

        <nav className={styles.nav}>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === navItems[0]?.to}
              className={({ isActive }): string =>
                `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
              }
              onClick={onClose}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className={styles.footer}>
          <span className={styles.userName}>{userName}</span>
          <div className={styles.footerActions}>
            <ThemeToggle />
            <LogoutButton />
          </div>
        </div>
      </aside>
    </>
  )
}
