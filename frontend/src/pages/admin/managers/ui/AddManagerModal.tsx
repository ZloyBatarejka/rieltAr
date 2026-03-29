import { type ReactElement } from 'react'
import { useForm, Controller, type SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { TextField } from '@consta/uikit/TextField'
import { Button } from '@consta/uikit/Button'
import { ClosableModal, ModalBody, ModalFooter } from '@/shared/ui/ClosableModal'
import adminStyles from '../../admin.module.css'

const createManagerSchema = z.object({
  email: z.string().min(1, 'Введите email').email('Некорректный email'),
  password: z.string().min(1, 'Введите пароль').min(6, 'Минимум 6 символов'),
  name: z.string().min(1, 'Введите имя'),
})

type CreateManagerFormValues = z.infer<typeof createManagerSchema>

interface AddManagerModalProps {
  isOpen: boolean
  onClose: () => void
  onAddManager: (values: CreateManagerFormValues) => Promise<void>
}

export function AddManagerModal({
  isOpen,
  onClose,
  onAddManager,
}: AddManagerModalProps): ReactElement {
  const {
    control,
    handleSubmit,
    reset,
  } = useForm<CreateManagerFormValues>({
    resolver: zodResolver(createManagerSchema),
    defaultValues: { email: '', password: '', name: '' },
  })

  const onSubmit: SubmitHandler<CreateManagerFormValues> = async (values) => {
    await onAddManager(values)
    reset()
  }

  return (
    <ClosableModal open={isOpen} onClose={onClose} title="Добавить менеджера">
      <form onSubmit={handleSubmit(onSubmit)}>
        <ModalBody>
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
