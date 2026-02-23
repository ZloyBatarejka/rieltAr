import { type ReactElement } from 'react'
import { Heading, Text, VStack } from '@chakra-ui/react'

function AdminDashboardPage(): ReactElement {
  return (
    <VStack align="stretch" spacing={4}>
      <Heading size="lg">Панель администратора</Heading>
      <Text>
        Управление менеджерами, собственниками, объектами и назначениями.
      </Text>
    </VStack>
  )
}

export default AdminDashboardPage
