import { type ReactElement, useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { Button } from '@consta/uikit/Button'
import { TextField } from '@consta/uikit/TextField'
import { Select } from '@consta/uikit/Select'
import { Text } from '@consta/uikit/Text'
import { Loader } from '@consta/uikit/Loader'
import { useForm, Controller, type SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ClosableModal } from '@/shared/ui/ClosableModal'
import type { CreatePayout } from '@/shared/types'
import { formatCurrency } from '@/pages/manager/owner-detail/lib'
import { payoutsPageStore } from '../model/payouts-page.store'
import styles from './CreatePayoutModal.module.css'

const createPayoutFormSchema = z.object({
  ownerId: z.string().min(1, 'Выберите собственника'),
  propertyId: z.string().min(1, 'Выберите объект'),
  amount: z
    .string()
    .min(1, 'Введите сумму')
    .refine((v) => !Number.isNaN(Number(v.replace(',', '.'))), 'Некорректное число')
    .refine((v) => Number(v.replace(',', '.')) > 0, 'Сумма должна быть больше нуля'),
  comment: z.string(),
})

type CreatePayoutFormValues = z.infer<typeof createPayoutFormSchema>

interface SelectItem {
  id: string
  label: string
}

interface CreatePayoutModalProps {
  isOpen: boolean
  onClose: () => void
}

export const CreatePayoutModal = observer(function CreatePayoutModal({
  isOpen,
  onClose,
}: CreatePayoutModalProps): ReactElement {
  const [step, setStep] = useState<1 | 2>(1)

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<CreatePayoutFormValues>({
    resolver: zodResolver(createPayoutFormSchema),
    defaultValues: {
      ownerId: '',
      propertyId: '',
      amount: '',
      comment: '',
    },
  })

  const ownerId = watch('ownerId')
  const propertyId = watch('propertyId')
  const amountStr = watch('amount')
  const commentStr = watch('comment')

  useEffect(() => {
    if (!isOpen) {
      reset()
      setStep(1)
      payoutsPageStore.clearOwnerContext()
    }
  }, [isOpen, reset])

  const ownerItems: SelectItem[] = payoutsPageStore.owners.map((o) => ({
    id: o.id,
    label: o.name,
  }))

  const propertyItems: SelectItem[] =
    payoutsPageStore.propertiesForSelectedOwner.map((p) => ({
      id: p.id,
      label: p.title,
    }))

  const selectedOwnerName =
    ownerItems.find((i) => i.id === ownerId)?.label ?? ''
  const selectedPropertyTitle =
    propertyItems.find((i) => i.id === propertyId)?.label ?? ''

  const goToConfirm: SubmitHandler<CreatePayoutFormValues> = () => {
    setStep(2)
  }

  const handleConfirm = async (): Promise<void> => {
    const amountNum = Number(amountStr.replace(',', '.'))
    const payload: CreatePayout = {
      propertyId,
      amount: amountNum,
    }
    const trimmed = commentStr.trim()
    if (trimmed !== '') {
      payload.comment = trimmed
    }
    const ok = await payoutsPageStore.createPayout(payload)
    if (ok) {
      onClose()
    }
  }

  const balance = payoutsPageStore.selectedOwnerBalance

  return (
    <ClosableModal
      open={isOpen}
      onClose={onClose}
      title={step === 1 ? 'Новая выплата' : 'Подтверждение выплаты'}
    >
      {step === 1 ? (
        <form onSubmit={handleSubmit(goToConfirm)}>
          <ClosableModal.Body>
            <div className={styles.stack}>
              <Controller
                name="ownerId"
                control={control}
                render={({ field }) => {
                  const selected =
                    ownerItems.find((i) => i.id === field.value) ?? null
                  return (
                    <Select
                      items={ownerItems}
                      value={selected}
                      onChange={(item) => {
                        const id = item?.id ?? ''
                        field.onChange(id)
                        if (id !== '') {
                          void payoutsPageStore.loadOwnerContext(id)
                        } else {
                          payoutsPageStore.clearOwnerContext()
                        }
                      }}
                      getItemLabel={(i) => i.label}
                      getItemKey={(i) => i.id}
                      label="Собственник"
                      labelPosition="top"
                      placeholder="Выберите собственника"
                      status={errors.ownerId ? 'alert' : undefined}
                      caption={errors.ownerId?.message}
                    />
                  )
                }}
              />
              {payoutsPageStore.isLoadingOwnerContext && ownerId !== '' ? (
                <Loader size="s" />
              ) : null}
              {ownerId !== '' &&
              !payoutsPageStore.isLoadingOwnerContext &&
              balance !== null ? (
                <div className={styles.balanceRow}>
                  <Text size="s" view="secondary">
                    Баланс собственника
                  </Text>
                  <Text size="m" weight="semibold" view="primary">
                    {formatCurrency(balance)}
                  </Text>
                </div>
              ) : null}
              <Controller
                name="propertyId"
                control={control}
                render={({ field }) => {
                  const selected =
                    propertyItems.find((i) => i.id === field.value) ?? null
                  return (
                    <Select
                      items={propertyItems}
                      value={selected}
                      onChange={(item) => field.onChange(item?.id ?? '')}
                      getItemLabel={(i) => i.label}
                      getItemKey={(i) => i.id}
                      label="Объект"
                      labelPosition="top"
                      placeholder={
                        ownerId === ''
                          ? 'Сначала выберите собственника'
                          : 'Выберите объект'
                      }
                      disabled={ownerId === '' || propertyItems.length === 0}
                      status={errors.propertyId ? 'alert' : undefined}
                      caption={errors.propertyId?.message}
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
                    label="Сумма выплаты"
                    labelPosition="top"
                    placeholder="0"
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
                    label="Комментарий"
                    labelPosition="top"
                    placeholder="Необязательно"
                  />
                )}
              />
            </div>
          </ClosableModal.Body>
          <ClosableModal.Footer>
            <Button view="ghost" label="Отмена" onClick={onClose} type="button" />
            <Button type="submit" label="Продолжить" />
          </ClosableModal.Footer>
        </form>
      ) : (
        <>
          <ClosableModal.Body>
            <div className={styles.confirmBlock}>
              <Text size="s" view="secondary">
                Проверьте данные перед созданием выплаты.
              </Text>
              <Text size="s" weight="semibold" view="primary">
                Собственник: {selectedOwnerName}
              </Text>
              {balance !== null ? (
                <Text size="s" weight="semibold" view="primary">
                  Баланс: {formatCurrency(balance)}
                </Text>
              ) : null}
              <Text size="s" weight="semibold" view="primary">
                Объект: {selectedPropertyTitle}
              </Text>
              <Text size="s" weight="semibold" view="primary">
                Сумма:{' '}
                {formatCurrency(Number(amountStr.replace(',', '.')))}
              </Text>
              {commentStr.trim() !== '' ? (
                <Text size="s" view="primary">
                  Комментарий: {commentStr.trim()}
                </Text>
              ) : null}
            </div>
          </ClosableModal.Body>
          <ClosableModal.Footer>
            <Button
              view="ghost"
              label="Назад"
              type="button"
              onClick={() => setStep(1)}
            />
            <Button
              view="primary"
              label="Подтвердить"
              loading={payoutsPageStore.isSubmitting}
              type="button"
              onClick={() => void handleConfirm()}
            />
          </ClosableModal.Footer>
        </>
      )}
    </ClosableModal>
  )
})
