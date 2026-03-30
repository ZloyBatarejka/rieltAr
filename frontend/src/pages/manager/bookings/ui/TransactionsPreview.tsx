import { type ReactElement } from 'react'
import { Text } from '@consta/uikit/Text'
import styles from './TransactionsPreview.module.css'
import { StyledBadge } from '@/shared/ui/StyledBadge'

type BadgeStatus = 'success' | 'warning' | 'error' | 'normal'

interface PreviewTransaction {
  type: string
  label: string
  amount: number
  status: BadgeStatus
}

interface TransactionsPreviewProps {
  totalAmount: number
  commissionPercent: number
  cleaningAmount: number
}

export function TransactionsPreview({
  totalAmount,
  commissionPercent,
  cleaningAmount,
}: TransactionsPreviewProps): ReactElement {
  const transactions: PreviewTransaction[] = []

  if (totalAmount > 0) {
    transactions.push({
      type: 'INCOME',
      label: 'Доход',
      amount: totalAmount,
      status: 'success',
    })
  }

  if (commissionPercent > 0 && totalAmount > 0) {
    const commission =
      Math.round(((totalAmount * commissionPercent) / 100) * 100) / 100
    transactions.push({
      type: 'COMMISSION',
      label: 'Комиссия',
      amount: commission,
      status: 'warning',
    })
  }

  if (cleaningAmount > 0) {
    transactions.push({
      type: 'CLEANING',
      label: 'Уборка',
      amount: cleaningAmount,
      status: 'warning',
    })
  }

  if (transactions.length === 0) {
    return (
      <Text view="secondary" size="s">
        Заполните форму для предпросмотра
      </Text>
    )
  }

  return (
    <div className={styles.stack}>
      <Text weight="semibold" size="s" view="primary">
        Будут созданы операции:
      </Text>
      {transactions.map((tx) => (
        <div key={tx.type} className={styles.row}>
          <StyledBadge status={tx.status} label={tx.label} size="s" />
          <Text weight="semibold" view="primary">
            {tx.type === 'INCOME' ? '+' : '−'}
            {tx.amount.toLocaleString('ru-RU')} ₽
          </Text>
        </div>
      ))}
    </div>
  )
}
