import { type ReactElement } from 'react'
import { observer } from 'mobx-react-lite'
import {
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
} from '@chakra-ui/react'
import { AddIcon, SearchIcon } from '@chakra-ui/icons'
import { authStore } from '@/entities/auth'
import { Show } from '@/shared/ui/Show'
import { managerPropertiesStore } from '../model/manager-properties.store'

export const PropertiesTableHeader = observer(
  function PropertiesTableHeader(): ReactElement {
    const canManage = authStore.user?.canCreateProperties === true

    return (
      <HStack mb={4} spacing={2}>
        <InputGroup size="sm">
          <InputLeftElement pointerEvents="none">
            <SearchIcon />
          </InputLeftElement>
          <Input
            placeholder="Поиск по названию или адресу…"
            value={managerPropertiesStore.search}
            onChange={(e) => managerPropertiesStore.setSearch(e.target.value)}
          />
        </InputGroup>
        <Show when={canManage}>
          <IconButton
            aria-label="Добавить"
            icon={<AddIcon />}
            colorScheme="blue"
            size="sm"
            onClick={() => managerPropertiesStore.openAddModal()}
          />
        </Show>
      </HStack>
    )
  },
)
