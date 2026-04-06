import { type ReactElement } from 'react'
import { useNavigate } from 'react-router-dom'
import type { CabinetBasePath } from '@/shared/lib/cabinetBasePath'
import { Button } from '@consta/uikit/Button'
import { Text } from '@consta/uikit/Text'
import { IconArrowLeft } from '@consta/icons/IconArrowLeft'
import type { OwnerDetail } from '@/shared/types'
import styles from './OwnerHeader.module.css'

interface OwnerHeaderProps {
  owner: OwnerDetail
  cabinetBasePath: CabinetBasePath
}

export function OwnerHeader({
  owner,
  cabinetBasePath,
}: OwnerHeaderProps): ReactElement {
  const navigate = useNavigate()

  return (
    <div className={styles.header}>
      <Button
        size="s"
        view="ghost"
        onlyIcon
        iconLeft={IconArrowLeft}
        onClick={() => navigate(`${cabinetBasePath}/owners`)}
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
