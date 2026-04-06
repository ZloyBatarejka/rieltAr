import { type ReactElement, useMemo } from 'react'
import { Button } from '@consta/uikit/Button'
import { TextField } from '@consta/uikit/TextField'
import { Select } from '@consta/uikit/Select'
import { useForm, Controller, type SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ClosableModal } from '@/shared/ui/ClosableModal'
import {
  TRANSACTION_TYPES,
  TRANSACTION_TYPE_INCOME,
  type CreateTransaction,
  type Property,
  type TransactionType,
} from '@/shared/types'
import { typeLabels } from '@/pages/manager/owner-detail/lib'
import styles from './AddTransactionModal.module.css'

function transactionTypeFromSelectId(id: string): TransactionType {
  for (const t of TRANSACTION_TYPES) {
    if (t === id) return t
  }
  return TRANSACTION_TYPE_INCOME
}

const createTransactionSchema = z.object({
  propertyId: z.string().min(1, 'Выберите объект'),
  type: z.enum(TRANSACTION_TYPES),
  amount: z
    .string()
    .min(1, 'Введите сумму')
    .refine((v) => !Number.isNaN(Number(v.replace(',', '.'))), 'Некорректное число'),
  comment: z.string(),
})

type CreateTransactionFormValues = z.infer<typeof createTransactionSchema>

interface SelectItem {
  id: string
  label: string
}

interface AddTransactionModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (values: CreateTransaction) => Promise<boolean>
  properties: Property[]
  isSubmitting: boolean
}

export function AddTransactionModal({
  isOpen,
  onClose,
  onAdd,
  properties,
  isSubmitting,
}: AddTransactionModalProps): ReactElement {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateTransactionFormValues>({
    resolver: zodResolver(createTransactionSchema),
    defaultValues: {
      propertyId: '',
      type: TRANSACTION_TYPE_INCOME,
      amount: '',
      comment: '',
    },
  })

  const propertyItems: SelectItem[] = useMemo(
    () => properties.map((p) => ({ id: p.id, label: p.title })),
    [properties],
  )

  const typeItems: SelectItem[] = useMemo(
    () => TRANSACTION_TYPES.map((t) => ({ id: t, label: typeLabels[t] })),
    [],
  )

  const onSubmit: SubmitHandler<CreateTransactionFormValues> = async (values) => {
    const amountNum = Number(values.amount.replace(',', '.'))
    const payload: CreateTransaction = {
      propertyId: values.propertyId,
      type: values.type,
      amount: amountNum,
    }
    const trimmed = values.comment.trim()
    if (trimmed !== '') {
      payload.comment = trimmed
    }
    const ok = await onAdd(payload)
    if (ok) {
      reset()
    }
  }

  return (
    <ClosableModal open={isOpen} onClose={onClose} title="Добавить операцию">
      <form onSubmit={handleSubmit(onSubmit)}>
        <ClosableModal.Body>
          <div className={styles.stack}>
            <Controller
              name="propertyId"
              control={control}
              render={({ field }) => {
                const selected = propertyItems.find((i) => i.id === field.value) ?? null
                return (
                  <Select
                    items={propertyItems}
                    value={selected}
                    onChange={(item) => field.onChange(item?.id ?? '')}
                    getItemLabel={(i) => i.label}
                    getItemKey={(i) => i.id}
                    placeholder="Объект"
                    status={errors.propertyId ? 'alert' : undefined}
                    caption={errors.propertyId?.message}
                  />
                )
              }}
            />
            <Controller
              name="type"
              control={control}
              render={({ field }) => {
                const selected = typeItems.find((i) => i.id === field.value) ?? null
                return (
                  <Select
                    items={typeItems}
                    value={selected}
                    onChange={(item) =>
                      field.onChange(
                        transactionTypeFromSelectId(item?.id ?? TRANSACTION_TYPE_INCOME),
                      )
                    }
                    getItemLabel={(i) => i.label}
                    getItemKey={(i) => i.id}
                    placeholder="Тип"
                  />
                )
              }}
            />
            <Controller
              name="amount"
              control={control}
              render={({ field }) => (
                <TextField
                  value={field.value}
                  onChange={(v) => field.onChange(v ?? '')}
                  placeholder="Сумма"
                  type="number"
                  status={errors.amount ? 'alert' : undefined}
                  caption={errors.amount?.message}
                />
              )}
            />
            <Controller
              name="comment"
              control={control}
              render={({ field }) => (
                <TextField
                  value={field.value}
                  onChange={(v) => field.onChange(v ?? '')}
                  placeholder="Комментарий (необязательно)"
                />
              )}
            />
          </div>
        </ClosableModal.Body>
        <ClosableModal.Footer>
          <Button view="ghost" label="Отмена" onClick={onClose} type="button" />
          <Button type="submit" label="Сохранить" loading={isSubmitting} />
        </ClosableModal.Footer>
      </form>
    </ClosableModal>
  )
}
