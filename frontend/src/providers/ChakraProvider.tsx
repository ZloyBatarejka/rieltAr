import { ChakraProvider as Provider, ColorModeScript } from '@chakra-ui/react'
import type { PropsWithChildren, ReactElement } from 'react'
import { theme } from '../theme'

export function ChakraProvider({ children }: PropsWithChildren): ReactElement {
  return (
    <Provider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      {children}
    </Provider>
  )
}
