import { type ReactElement } from 'react'
import { IconButton, useColorMode } from '@chakra-ui/react'
import { MoonIcon, SunIcon } from '@chakra-ui/icons'

export function ThemeToggle(): ReactElement {
  const { colorMode, toggleColorMode } = useColorMode()

  return (
    <IconButton
      aria-label="Переключить тему"
      icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
      variant="ghost"
      size="sm"
      onClick={toggleColorMode}
    />
  )
}
