import { type ReactElement, useEffect } from 'react'
import { useForm, Controller, type SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { TextField } from '@consta/uikit/TextField'
import { Button } from '@consta/uikit/Button'
import { ClosableModal, ModalBody, ModalFooter } from '@/shared/ui/ClosableModal'
import { Show } from '@/shared/ui/Show'
import type { Owner, Property } from '@/shared/types'
import adminStyles from '../../admin.module.css'

const editPropertySchema = z.object({
  title: z.string().min(1, 'Введите название'),
  address: z.string().min(1, 'Введите адрес'),
  ownerId: z.string().min(1, 'Выберите собственника'),
})

type EditPropertyFormValues = z.infer<typeof editPropertySchema>

interface EditPropertyModalProps {
  isOpen: boolean
  onClose: () => void
  property: Property | null
  owners: Owner[]
  onSave: (values: EditPropertyFormValues) => Promise<void>
}

export function EditPropertyModal({
  isOpen,
  onClose,
  property,
  owners,
  onSave,
}: EditPropertyModalProps): ReactElement {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EditPropertyFormValues>({
    resolver: zodResolver(editPropertySchema),
    defaultValues: { title: '', address: '', ownerId: '' },
  })

  useEffect(() => {
    if (isOpen && property) {
      reset({
        title: property.title,
        address: property.address,
        ownerId: property.ownerId,
      })
    }
  }, [isOpen, property, reset])

  const onSubmit: SubmitHandler<EditPropertyFormValues> = async (values) => {
    await onSave(values)
  }

  return (
    <ClosableModal
      open={isOpen}
      onClose={onClose}
      title="Редактировать объект"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <ModalBody>
          <div className={adminStyles.formFields}>
            <Controller
              name="title"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  label="Название"
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Квартира на Тверской"
                  status={fieldState.error ? 'alert' : undefined}
                  caption={fieldState.error?.message}
                />
              )}
            />
            <Controller
              name="address"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  label="Адрес"
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="ул. Тверская, д. 1"
                  status={fieldState.error ? 'alert' : undefined}
                  caption={fieldState.error?.message}
                />
              )}
            />
            <div className={adminStyles.selectWrapper}>
              <label className={adminStyles.selectLabel}>Собственник</label>
              <select
                className={`${adminStyles.select} ${errors.ownerId ? adminStyles.selectError : ''}`}
                {...register('ownerId')}
              >
                <option value="">Выберите собственника</option>
                {owners.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.name}
                  </option>
                ))}
              </select>
              <Show when={errors.ownerId}>
                <span className={adminStyles.errorText}>
                  {errors.ownerId?.message}
                </span>
              </Show>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button view="ghost" label="Отмена" onClick={onClose} type="button" />
          <Button view="primary" label="Сохранить" type="submit" />
        </ModalFooter>
      </form>
    </ClosableModal>
  )
}
