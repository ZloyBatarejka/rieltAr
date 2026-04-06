import type { ReactElement } from 'react'
import { Text } from '@consta/uikit/Text'

interface OwnerDashboardHeaderProps {
  userName: string
  className?: string
}

export const OwnerDashboardHeader: React.FC<OwnerDashboardHeaderProps> = ({
  userName,
  className,
}): ReactElement => {
  return (
    <div className={className}>
      <Text size="2xl" weight="bold" view="primary" as="h1">
        Дашборд
      </Text>
      <Text view="secondary" size="m">
        {userName}, краткая сводка по вашим объектам
      </Text>
    </div>
  )
}

