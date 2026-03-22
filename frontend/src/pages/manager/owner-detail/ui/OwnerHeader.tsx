import { type ReactElement } from 'react'
import { useNavigate } from 'react-router-dom'
import { Heading, HStack, IconButton, Text } from '@chakra-ui/react'
import { ArrowBackIcon } from '@chakra-ui/icons'
import type { OwnerDetail } from '@/shared/types'

interface OwnerHeaderProps {
  owner: OwnerDetail
}

export function OwnerHeader({ owner }: OwnerHeaderProps): ReactElement {
  const navigate = useNavigate()

  return (
    <HStack mb={6} spacing={3} align="center">
      <IconButton
        aria-label="Назад"
        icon={<ArrowBackIcon />}
        variant="ghost"
        size="sm"
        onClick={() => navigate('/manager/owners')}
      />
      <Heading size="lg" flex={1}>
        {owner.name}
      </Heading>
      <Text
        fontSize="xl"
        fontWeight="bold"
        color={owner.balance >= 0 ? 'green.500' : 'red.500'}
        whiteSpace="nowrap"
      >
        {owner.balance.toLocaleString('ru-RU')} ₽
      </Text>
    </HStack>
  )
}
