import type { PropsWithChildren } from 'react'
import { observer } from 'mobx-react-lite'
import { Theme, presetGpnDefault, presetGpnDark } from '@consta/uikit/Theme'
import { themeStore } from '@/shared/model/theme.store'

export const ConstaProvider: React.FC<PropsWithChildren> = observer(
  ({ children }) => {
    const preset = themeStore.isDark ? presetGpnDark : presetGpnDefault
    return <Theme preset={preset}>{children}</Theme>
  },
)
