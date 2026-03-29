import { type ReactElement } from 'react'
import { useForm, Controller, type SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { TextField } from '@consta/uikit/TextField'
import { Button } from '@consta/uikit/Button'
import { ClosableModal, ModalBody, ModalFooter } from '@/shared/ui/ClosableModal'
import { Show } from '@/shared/ui/Show'
import type { Owner } from '@/shared/types'
import adminStyles from '../../admin.module.css'

const createPropertySchema = z.object({
  title: z.string().min(1, 'Введите название'),
  address: z.string().min(1, 'Введите адрес'),
  ownerId: z.string().min(1, 'Выберите собственника'),
})

type CreatePropertyFormValues = z.infer<typeof createPropertySchema>

interface AddPropertyModalProps {
  isOpen: boolean
  onClose: () => void
  owners: Owner[]
  onAddProperty: (values: CreatePropertyFormValues) => Promise<void>
}

export function AddPropertyModal({
  isOpen,
  onClose,
  owners,
  onAddProperty,
}: AddPropertyModalProps): ReactElement {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreatePropertyFormValues>({
    resolver: zodResolver(createPropertySchema),
    defaultValues: { title: '', address: '', ownerId: '' },
  })

  const onSubmit: SubmitHandler<CreatePropertyFormValues> = async (values) => {
    await onAddProperty(values)
    reset()
  }

  return (
    <ClosableModal open={isOpen} onClose={onClose} title="Добавить объект">
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
          <Button view="primary" label="Создать" type="submit" />
        </ModalFooter>
      </form>
    </ClosableModal>
  )
}
