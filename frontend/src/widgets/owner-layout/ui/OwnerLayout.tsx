import { type ReactElement } from 'react'
import { observer } from 'mobx-react-lite'
import { authStore } from '../../../entities/auth'
import { AppLayout } from '../../app-layout'
import type { NavItem } from '../../sidebar'

const ownerNavItems: NavItem[] = [
  { to: '/owner', label: 'Дашборд' },
  { to: '/owner/properties', label: 'Объекты' },
  { to: '/owner/bookings', label: 'Заезды' },
  { to: '/owner/operations', label: 'Операции' },
  { to: '/owner/payouts', label: 'Выплаты' },
]

export const OwnerLayout = observer(function OwnerLayout(): ReactElement {
  const userName = authStore.user?.name ?? 'Собственник'

  return (
    <AppLayout
      title="Собственник"
      navItems={ownerNavItems}
      userName={userName}
    />
  )
})
