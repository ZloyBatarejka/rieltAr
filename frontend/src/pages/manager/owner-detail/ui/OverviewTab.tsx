import { type ReactElement } from 'react'
import {
  Stat,
  StatLabel,
  StatNumber,
  Card,
  CardBody,
  Text,
  Badge,
} from '@chakra-ui/react'
import type { OverviewTabProps } from '../model/types'
import { formatCurrency, formatSignedAmount, typeLabels, typeColors, txAmountColor } from '../lib'
import styles from './OverviewTab.module.css'

export function OverviewTab({ dashboard }: OverviewTabProps): ReactElement {
  return (
    <div className={styles.wrapper}>
      <div className={styles.statsRow}>
        <StatCard label="Доход" value={dashboard.income} color="green.500" />
        <StatCard label="Расходы" value={dashboard.expenses} color="red.500" />
        <StatCard
          label="Выплачено"
          value={dashboard.payouts}
          color="blue.500"
        />
        <StatCard label="Объектов" value={dashboard.propertiesCount} />
      </div>

      <Card>
        <CardBody>
          <Text fontWeight="semibold" mb={3}>
            Последние операции
          </Text>
          {dashboard.lastTransactions.length === 0 ? (
            <Text>Нет операций</Text>
          ) : (
            <div className={styles.txList}>
              {dashboard.lastTransactions.map((tx) => (
                <div key={tx.id} className={styles.txRow}>
                  <Badge colorScheme={typeColors[tx.type]} w="fit-content">
                    {typeLabels[tx.type]}
                  </Badge>
                  <Text className={styles.txComment}>{tx.comment ?? ''}</Text>
                  <Text
                    className={styles.txAmount}
                    color={txAmountColor(tx.type)}
                  >
                    {formatSignedAmount(tx.type, tx.amount)}
                  </Text>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  )
}

function StatCard({
  label,
  value,
  color,
}: {
  label: string
  value: number
  color?: string
}): ReactElement {
  return (
    <Card className={styles.statCard}>
      <CardBody>
        <Stat>
          <StatLabel>{label}</StatLabel>
          <StatNumber fontSize="xl" color={color}>
            {typeof value === 'number' && label !== 'Объектов'
              ? formatCurrency(value)
              : value}
          </StatNumber>
        </Stat>
      </CardBody>
    </Card>
  )
}
