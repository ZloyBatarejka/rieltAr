import { type ReactElement, useMemo } from 'react'
import { Button } from '@consta/uikit/Button'
import { TextField } from '@consta/uikit/TextField'
import { Select } from '@consta/uikit/Select'
import { useForm, Controller, type SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ClosableModal } from '@/shared/ui/ClosableModal'
import type { Owner } from '@/shared/types'
import styles from './AddPropertyModal.module.css'

const createPropertySchema = z.object({
  title: z.string().min(1, 'Введите название'),
  address: z.string().min(1, 'Введите адрес'),
  ownerId: z.string().min(1, 'Выберите собственника'),
})

type CreatePropertyFormValues = z.infer<typeof createPropertySchema>

interface SelectItem {
  id: string
  label: string
}

interface AddPropertyModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (values: CreatePropertyFormValues) => Promise<void>
  owners: Owner[]
}

export function AddPropertyModal({
  isOpen,
  onClose,
  onAdd,
  owners,
}: AddPropertyModalProps): ReactElement {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreatePropertyFormValues>({
    resolver: zodResolver(createPropertySchema),
    defaultValues: { title: '', address: '', ownerId: '' },
  })

  const ownerItems: SelectItem[] = useMemo(
    () => owners.map((o) => ({ id: o.id, label: o.name })),
    [owners],
  )

  const onSubmit: SubmitHandler<CreatePropertyFormValues> = async (values) => {
    await onAdd(values)
    reset()
  }

  return (
    <ClosableModal open={isOpen} onClose={onClose} title="Добавить объект">
      <form onSubmit={handleSubmit(onSubmit)}>
        <ClosableModal.Body>
          <div className={styles.stack}>
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <TextField
                  value={field.value}
                  onChange={(v) => field.onChange(v ?? '')}
                  placeholder="Название"
                  status={errors.title ? 'alert' : undefined}
                  caption={errors.title?.message}
                />
              )}
            />
            <Controller
              name="address"
              control={control}
              render={({ field }) => (
                <TextField
                  value={field.value}
                  onChange={(v) => field.onChange(v ?? '')}
                  placeholder="Адрес"
                  status={errors.address ? 'alert' : undefined}
                  caption={errors.address?.message}
                />
              )}
            />
            <Controller
              name="ownerId"
              control={control}
              render={({ field }) => {
                const selected = ownerItems.find((i) => i.id === field.value) ?? null
                return (
                  <Select
                    items={ownerItems}
                    value={selected}
                    onChange={(item) => field.onChange(item?.id ?? '')}
                    getItemLabel={(i) => i.label}
                    getItemKey={(i) => i.id}
                    placeholder="Собственник"
                    status={errors.ownerId ? 'alert' : undefined}
                    caption={errors.ownerId?.message}
                  />
                )
              }}
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
