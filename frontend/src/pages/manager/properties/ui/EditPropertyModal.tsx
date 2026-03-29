import { type ReactElement, useEffect, useMemo } from 'react'
import { Button } from '@consta/uikit/Button'
import { TextField } from '@consta/uikit/TextField'
import { Select } from '@consta/uikit/Select'
import { useForm, Controller, type SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ClosableModal, ModalBody, ModalFooter } from '@/shared/ui/ClosableModal'
import type { Property, Owner } from '@/shared/types'
import styles from './EditPropertyModal.module.css'

const editPropertySchema = z.object({
  title: z.string().min(1, 'Введите название'),
  address: z.string().min(1, 'Введите адрес'),
  ownerId: z.string().min(1, 'Выберите собственника'),
})

type EditPropertyFormValues = z.infer<typeof editPropertySchema>

interface SelectItem {
  id: string
  label: string
}

interface EditPropertyModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (values: EditPropertyFormValues) => Promise<void>
  property: Property
  owners: Owner[]
}

export function EditPropertyModal({
  isOpen,
  onClose,
  onSave,
  property,
  owners,
}: EditPropertyModalProps): ReactElement {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EditPropertyFormValues>({
    resolver: zodResolver(editPropertySchema),
    defaultValues: {
      title: property.title,
      address: property.address,
      ownerId: property.ownerId,
    },
  })

  const ownerItems: SelectItem[] = useMemo(
    () => owners.map((o) => ({ id: o.id, label: o.name })),
    [owners],
  )

  useEffect(() => {
    reset({
      title: property.title,
      address: property.address,
      ownerId: property.ownerId,
    })
  }, [property, reset])

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
        </ModalBody>
        <ModalFooter>
          <Button view="ghost" label="Отмена" onClick={onClose} type="button" />
          <Button view="primary" label="Сохранить" type="submit" />
        </ModalFooter>
      </form>
    </ClosableModal>
  )
}
