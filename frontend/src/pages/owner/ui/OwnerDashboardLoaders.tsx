import type { ReactElement } from 'react'
import { Loader } from '@consta/uikit/Loader'
import { Text } from '@consta/uikit/Text'

interface OwnerDashboardCenteredLoaderProps {
  className?: string
}

export const OwnerDashboardCenteredLoader: React.FC<OwnerDashboardCenteredLoaderProps> = ({
  className,
}): ReactElement => {
  return (
    <div className={className}>
      <Loader size="m" />
    </div>
  )
}

interface OwnerDashboardInlineLoaderProps {
  className?: string
}

export const OwnerDashboardInlineLoader: React.FC<OwnerDashboardInlineLoaderProps> = ({
  className,
}): ReactElement => {
  return (
    <div className={className}>
      <Loader size="s" />
      <Text size="s" view="secondary">
        Обновление…
      </Text>
    </div>
  )
}

