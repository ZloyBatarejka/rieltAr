import { type ReactElement } from 'react'
import { observer } from 'mobx-react-lite'
import { authStore } from '@/entities/auth'
import { AppLayout } from '../../app-layout'
import type { NavItem } from '../../sidebar'

const managerNavItems: NavItem[] = [
  { to: '/manager', label: 'Дашборд' },
  { to: '/manager/owners', label: 'Собственники' },
  { to: '/manager/properties', label: 'Объекты' },
  { to: '/manager/bookings', label: 'Заезды' },
  { to: '/manager/operations', label: 'Операции' },
  { to: '/manager/payouts', label: 'Выплаты' },
]

export const ManagerLayout = observer(function ManagerLayout(): ReactElement {
  const userName = authStore.user?.name ?? 'Менеджер'

  return (
    <AppLayout
      title="Менеджер"
      navItems={managerNavItems}
      userName={userName}
    />
  )
})
