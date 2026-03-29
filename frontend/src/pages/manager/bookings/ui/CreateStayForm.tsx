import { type ReactElement } from 'react'
import { observer } from 'mobx-react-lite'
import { Controller } from 'react-hook-form'
import { Button } from '@consta/uikit/Button'
import { Card } from '@consta/uikit/Card'
import { Text } from '@consta/uikit/Text'
import { TextField } from '@consta/uikit/TextField'
import { Select } from '@consta/uikit/Select'
import { Loader } from '@consta/uikit/Loader'
import { Show } from '@/shared/ui/Show'
import { createStayStore } from '../model/create-stay.store'
import { useCreateStayForm } from '../model/useCreateStayForm'
import { TransactionsPreview } from './TransactionsPreview'
import styles from './CreateStayForm.module.css'

interface SelectItem {
  id: string
  label: string
}

export const CreateStayForm = observer(function CreateStayForm(): ReactElement {
  const { register, control, errors, onSubmit, preview } = useCreateStayForm()

  const propertyItems: SelectItem[] = createStayStore.properties.map((p) => ({
    id: p.id,
    label: p.title,
  }))

  return (
    <Show
      when={!createStayStore.isLoadingProperties}
      fallback={
        <div className={styles.loaderWrap}>
          <Loader />
        </div>
      }
    >
      <Card verticalSpace="2xl" horizontalSpace="2xl" className={styles.card}>
        <Text size="xl" weight="bold" as="h2" view="primary" className={styles.heading}>
          Новый заезд
        </Text>
        <form onSubmit={onSubmit}>
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
                    label="Объект"
                    placeholder="Выберите объект"
                    status={errors.propertyId ? 'alert' : undefined}
                    caption={errors.propertyId?.message}
                  />
                )
              }}
            />

            <Controller
              name="guestName"
              control={control}
              render={({ field }) => (
                <TextField
                  value={field.value}
                  onChange={(v) => field.onChange(v ?? '')}
                  label="Имя гостя"
                  placeholder="Иван Иванов"
                  status={errors.guestName ? 'alert' : undefined}
                  caption={errors.guestName?.message}
                />
              )}
            />

            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label}>Заезд</label>
                <input
                  type="date"
                  {...register('checkIn')}
                  className={styles.dateInput}
                />
                <Show when={errors.checkIn}>
                  <span className={styles.error}>{errors.checkIn?.message}</span>
                </Show>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Выезд</label>
                <input
                  type="date"
                  {...register('checkOut')}
                  className={styles.dateInput}
                />
                <Show when={errors.checkOut}>
                  <span className={styles.error}>{errors.checkOut?.message}</span>
                </Show>
              </div>
            </div>

            <Controller
              name="totalAmount"
              control={control}
              render={({ field }) => (
                <TextField
                  value={field.value}
                  onChange={(v) => field.onChange(v ?? '')}
                  type="number"
                  label="Сумма заезда (₽)"
                  placeholder="25000"
                  status={errors.totalAmount ? 'alert' : undefined}
                  caption={errors.totalAmount?.message}
                />
              )}
            />

            <div className={styles.row}>
              <div className={styles.halfField}>
                <Controller
                  name="commissionPercent"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      value={field.value}
                      onChange={(v) => field.onChange(v ?? '')}
                      type="number"
                      label="Комиссия (%)"
                      placeholder="15"
                      status={errors.commissionPercent ? 'alert' : undefined}
                      caption={errors.commissionPercent?.message}
                    />
                  )}
                />
              </div>
              <div className={styles.halfField}>
                <Controller
                  name="cleaningAmount"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      value={field.value}
                      onChange={(v) => field.onChange(v ?? '')}
                      type="number"
                      label="Уборка (₽)"
                      placeholder="1500"
                      status={errors.cleaningAmount ? 'alert' : undefined}
                      caption={errors.cleaningAmount?.message}
                    />
                  )}
                />
              </div>
            </div>

            <hr className={styles.separator} />

            <TransactionsPreview
              totalAmount={preview.totalAmount}
              commissionPercent={preview.commissionPercent}
              cleaningAmount={preview.cleaningAmount}
            />

            <Button
              view="primary"
              label="Создать заезд"
              type="submit"
              loading={createStayStore.isSubmitting}
              className={styles.submitButton}
            />
          </div>
        </form>
      </Card>
    </Show>
  )
})
