import { type ReactElement } from 'react'
import { observer } from 'mobx-react-lite'
import { authStore } from '@/entities/auth'
import { AppLayout } from '../../app-layout'
import type { NavItem } from '../../sidebar'

const adminNavItems: NavItem[] = [
  { to: '/admin', label: 'Дашборд' },
  { to: '/admin/managers', label: 'Менеджеры' },
  { to: '/admin/owners', label: 'Собственники' },
  { to: '/admin/properties', label: 'Объекты' },
  { to: '/admin/assignments', label: 'Назначения' },
]

export const AdminLayout = observer(function AdminLayout(): ReactElement {
  const userName = authStore.user?.name ?? 'Администратор'

  return (
    <AppLayout
      title="Администратор"
      navItems={adminNavItems}
      userName={userName}
    />
  )
})
