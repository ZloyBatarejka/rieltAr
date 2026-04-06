import { type ReactElement, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { Card } from '@consta/uikit/Card'
import { Text } from '@consta/uikit/Text'
import { Button } from '@consta/uikit/Button'
import { Loader } from '@consta/uikit/Loader'
import { IconAdd } from '@consta/icons/IconAdd'
import { DataTable } from '@/shared/ui/DataTable'
import { Show } from '@/shared/ui/Show'
import { authStore } from '@/entities/auth'
import { getCabinetBasePath } from '@/shared/lib/cabinetBasePath'
import { bookingsPageStore } from './model/bookings-page.store'
import { staysColumns } from './model/columns'
import styles from './BookingsPage.module.css'

export const BookingsPage = observer(function BookingsPage(): ReactElement {
  const navigate = useNavigate()
  const user = authStore.user
  const cabinetBasePath = user ? getCabinetBasePath(user.role) : '/manager'

  useEffect(() => {
    void bookingsPageStore.fetchStays()
  }, [])

  return (
    <Card verticalSpace="2xl" horizontalSpace="2xl" className={styles.tableCard}>
      <div className={styles.headerRow}>
        <Text size="xl" weight="bold" as="h2" view="primary">Заезды</Text>
        <Button
          size="s"
          view="primary"
          onlyIcon
          iconLeft={IconAdd}
          onClick={() => navigate(`${cabinetBasePath}/bookings/create`)}
        />
      </div>
      <Show
        when={!bookingsPageStore.isLoading}
        fallback={
          <div className={styles.loaderWrap}>
            <Loader />
          </div>
        }
      >
        <DataTable
          items={bookingsPageStore.stays}
          columns={staysColumns}
          emptyText="Нет заездов"
          rowKey={(s) => s.id}
        />
      </Show>
    </Card>
  )
})
