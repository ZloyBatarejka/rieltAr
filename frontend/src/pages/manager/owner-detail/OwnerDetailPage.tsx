import { type ReactElement } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import {
  Box,
  Spinner,
  Center,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from '@chakra-ui/react'
import { useOwnerDetail } from './model/useOwnerDetail'
import { OwnerHeader } from './ui/OwnerHeader'
import { OverviewTab } from './ui/OverviewTab'
import { PropertiesTab } from './ui/PropertiesTab'
import { StaysTab } from './ui/StaysTab'
import { TransactionsTab } from './ui/TransactionsTab'
import { PayoutsTab } from './ui/PayoutsTab'

export function OwnerDetailPage(): ReactElement {
  const { id } = useParams<{ id: string }>()

  if (!id) {
    return <Navigate to="/manager/owners" replace />
  }

  return <OwnerDetailContent ownerId={id} />
}

function OwnerDetailContent({
  ownerId,
}: {
  ownerId: string
}): ReactElement {
  const {
    owner,
    dashboard,
    properties,
    stays,
    transactions,
    payouts,
    isLoading,
  } = useOwnerDetail(ownerId)

  if (isLoading) {
    return (
      <Center py={10}>
        <Spinner size="lg" />
      </Center>
    )
  }

  if (!owner || !dashboard) {
    return <Navigate to="/manager/owners" replace />
  }

  return (
    <Box>
      <OwnerHeader owner={owner} />
      <Tabs colorScheme="blue" isLazy>
        <TabList overflowX="auto" overflowY="hidden" whiteSpace="nowrap">
          <Tab>Обзор</Tab>
          <Tab>Объекты</Tab>
          <Tab>Заезды</Tab>
          <Tab>Операции</Tab>
          <Tab>Выплаты</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <OverviewTab dashboard={dashboard} />
          </TabPanel>
          <TabPanel>
            <PropertiesTab properties={properties} />
          </TabPanel>
          <TabPanel>
            <StaysTab stays={stays} />
          </TabPanel>
          <TabPanel>
            <TransactionsTab transactions={transactions} />
          </TabPanel>
          <TabPanel>
            <PayoutsTab payouts={payouts} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  )
}
