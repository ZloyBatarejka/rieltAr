import { type ReactElement } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@consta/uikit/Button'
import { Text } from '@consta/uikit/Text'
import { IconArrowLeft } from '@consta/icons/IconArrowLeft'
import type { OwnerDetail } from '@/shared/types'
import styles from './OwnerHeader.module.css'

interface OwnerHeaderProps {
  owner: OwnerDetail
}

export function OwnerHeader({ owner }: OwnerHeaderProps): ReactElement {
  const navigate = useNavigate()

  return (
    <div className={styles.header}>
      <Button
        size="s"
        view="ghost"
        onlyIcon
        iconLeft={IconArrowLeft}
        onClick={() => navigate('/manager/owners')}
      />
      <Text size="2xl" weight="bold" as="h1" view="primary" className={styles.name}>
        {owner.name}
      </Text>
      <Text
        size="xl"
        weight="bold"
        view={owner.balance >= 0 ? 'success' : 'alert'}
        className={styles.balance}
      >
        {owner.balance.toLocaleString('ru-RU')} ₽
      </Text>
    </div>
  )
}
