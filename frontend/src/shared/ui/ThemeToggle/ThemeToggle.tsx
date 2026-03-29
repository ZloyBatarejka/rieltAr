import { type ReactElement } from 'react'
import { observer } from 'mobx-react-lite'
import { Switch } from '@consta/uikit/Switch'
import { themeStore } from '@/shared/model/theme.store'

export const ThemeToggle: React.FC = observer((): ReactElement => {
  return (
    <Switch
      label="Тёмная тема"
      checked={themeStore.isDark}
      onChange={themeStore.toggle}
      size="s"
    />
  )
})
