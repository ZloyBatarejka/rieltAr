import { type ReactElement } from 'react'
import { useForm, Controller, type SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { TextField } from '@consta/uikit/TextField'
import { Button } from '@consta/uikit/Button'
import { ClosableModal } from '@/shared/ui/ClosableModal'
import adminStyles from '../../admin.module.css'

const createOwnerSchema = z.object({
  email: z.string().min(1, 'Введите email').email('Некорректный email'),
  password: z.string().min(1, 'Введите пароль').min(6, 'Минимум 6 символов'),
  name: z.string().min(1, 'Введите имя'),
  phone: z.string().optional(),
})

type CreateOwnerFormValues = z.infer<typeof createOwnerSchema>

interface AddOwnerModalProps {
  isOpen: boolean
  onClose: () => void
  onAddOwner: (values: CreateOwnerFormValues) => Promise<void>
}

export function AddOwnerModal({
  isOpen,
  onClose,
  onAddOwner,
}: AddOwnerModalProps): ReactElement {
  const {
    control,
    handleSubmit,
    reset,
  } = useForm<CreateOwnerFormValues>({
    resolver: zodResolver(createOwnerSchema),
    defaultValues: { email: '', password: '', name: '', phone: '' },
  })

  const onSubmit: SubmitHandler<CreateOwnerFormValues> = async (values) => {
    await onAddOwner(values)
    reset()
  }

  return (
    <ClosableModal
      open={isOpen}
      onClose={onClose}
      title="Добавить собственника"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <ClosableModal.Body>
          <div className={adminStyles.formFields}>
            <Controller
              name="email"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  value={field.value}
                  onChange={field.onChange}
                  type="email"
                  placeholder="Email"
                  status={fieldState.error ? 'alert' : undefined}
                  caption={fieldState.error?.message}
                />
              )}
            />
            <Controller
              name="password"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  value={field.value}
                  onChange={field.onChange}
                  type="password"
                  placeholder="Пароль"
                  status={fieldState.error ? 'alert' : undefined}
                  caption={fieldState.error?.message}
                />
              )}
            />
            <Controller
              name="name"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Имя"
                  status={fieldState.error ? 'alert' : undefined}
                  caption={fieldState.error?.message}
                />
              )}
            />
            <Controller
              name="phone"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  value={field.value ?? ''}
                  onChange={field.onChange}
                  placeholder="Телефон (необязательно)"
                  status={fieldState.error ? 'alert' : undefined}
                  caption={fieldState.error?.message}
                />
              )}
            />
          </div>
        </ClosableModal.Body>
        <ClosableModal.Footer>
          <Button view="ghost" label="Отмена" onClick={onClose} type="button" />
          <Button view="primary" label="Создать" type="submit" />
        </ClosableModal.Footer>
      </form>
    </ClosableModal>
  )
}
