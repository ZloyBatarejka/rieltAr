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
import { managerOwnersStore } from '../model/manager-owners.store'

export const OwnersTableHeader = observer(function OwnersTableHeader(): ReactElement {
  const canCreate = authStore.user?.canCreateOwners === true

  return (
    <HStack mb={4} spacing={2}>
      <InputGroup size="sm" maxW="300px">
        <InputLeftElement pointerEvents="none">
          <SearchIcon />
        </InputLeftElement>
        <Input
          placeholder="Поиск по имени…"
          value={managerOwnersStore.search}
          onChange={(e) => managerOwnersStore.setSearch(e.target.value)}
        />
      </InputGroup>
      {canCreate ? (
        <IconButton
          aria-label="Добавить"
          icon={<AddIcon />}
          colorScheme="blue"
          size="sm"
          onClick={() => managerOwnersStore.openModal()}
        />
      ) : null}
    </HStack>
  )
})
