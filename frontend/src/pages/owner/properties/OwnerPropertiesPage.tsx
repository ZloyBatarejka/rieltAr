import { type ReactElement, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { useNavigate } from 'react-router-dom'
import { Card } from '@consta/uikit/Card'
import { Loader } from '@consta/uikit/Loader'
import { Text } from '@consta/uikit/Text'
import { Show } from '@/shared/ui/Show'
import { ownerPropertiesStore } from './model/owner-properties.store'
import { OwnerPropertiesGrid } from './ui/OwnerPropertiesGrid'
import styles from './OwnerPropertiesPage.module.css'

export const OwnerPropertiesPage = observer(
  function OwnerPropertiesPage(): ReactElement {
    const navigate = useNavigate()

    useEffect(() => {
      void ownerPropertiesStore.fetch()
    }, [])

    const { properties, isLoading, error } = ownerPropertiesStore

    return (
      <Card verticalSpace="2xl" horizontalSpace="2xl">
        <Text
          size="xl"
          weight="bold"
          as="h1"
          view="primary"
          className={styles.heading}
        >
          Мои объекты
        </Text>
        <Text view="secondary" size="m" className={styles.lead}>
          Квартиры и дома, по которым ведётся учёт. Заезды открываются отдельно
          по каждому объекту.
        </Text>

        <Show when={error}>
          {(message) => (
            <Text view="alert" size="m">
              {message}
            </Text>
          )}
        </Show>

        <Show when={isLoading}>
          <div className={styles.loaderWrap}>
            <Loader size="m" />
          </div>
        </Show>

        <Show when={!isLoading && error === null && properties.length === 0}>
          <Text view="secondary" size="m">
            У вас пока нет объектов.
          </Text>
        </Show>

        <Show when={!isLoading && properties.length > 0}>
          <OwnerPropertiesGrid
            properties={properties}
            staysCountFor={(id) => ownerPropertiesStore.staysCountFor(id)}
            onOpenStays={(propertyId) => {
              navigate(
                `/owner/stays?propertyId=${encodeURIComponent(propertyId)}`,
              )
            }}
          />
        </Show>
      </Card>
    )
  },
)
