import { type ReactElement } from 'react'
import { Button } from '@consta/uikit/Button'
import { TextField } from '@consta/uikit/TextField'
import { useForm, Controller, type SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ClosableModal } from '@/shared/ui/ClosableModal'
import styles from './AddOwnerModal.module.css'

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
    formState: { errors },
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
          <div className={styles.stack}>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  value={field.value}
                  onChange={(v) => field.onChange(v ?? '')}
                  type="email"
                  placeholder="Email"
                  status={errors.email ? 'alert' : undefined}
                  caption={errors.email?.message}
                />
              )}
            />
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <TextField
                  value={field.value}
                  onChange={(v) => field.onChange(v ?? '')}
                  type="password"
                  placeholder="Пароль"
                  status={errors.password ? 'alert' : undefined}
                  caption={errors.password?.message}
                />
              )}
            />
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  value={field.value}
                  onChange={(v) => field.onChange(v ?? '')}
                  placeholder="Имя"
                  status={errors.name ? 'alert' : undefined}
                  caption={errors.name?.message}
                />
              )}
            />
            <Controller
              name="phone"
              control={control}
              render={({ field }) => (
                <TextField
                  value={field.value ?? ''}
                  onChange={(v) => field.onChange(v ?? '')}
                  placeholder="Телефон (необязательно)"
                  status={errors.phone ? 'alert' : undefined}
                  caption={errors.phone?.message}
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
