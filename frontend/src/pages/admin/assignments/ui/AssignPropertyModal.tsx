import { type ReactElement } from 'react'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@consta/uikit/Button'
import { ClosableModal, ModalBody, ModalFooter } from '@/shared/ui/ClosableModal'
import { Show } from '@/shared/ui/Show'
import type { Manager, Property } from '@/shared/types'
import adminStyles from '../../admin.module.css'

const assignSchema = z.object({
  userId: z.string().min(1, 'Выберите менеджера'),
  propertyId: z.string().min(1, 'Выберите объект'),
})

type AssignFormValues = z.infer<typeof assignSchema>

interface AssignPropertyModalProps {
  isOpen: boolean
  onClose: () => void
  managers: Manager[]
  properties: Property[]
  onAssign: (values: AssignFormValues) => Promise<void>
}

export function AssignPropertyModal({
  isOpen,
  onClose,
  managers,
  properties,
  onAssign,
}: AssignPropertyModalProps): ReactElement {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AssignFormValues>({
    resolver: zodResolver(assignSchema),
    defaultValues: { userId: '', propertyId: '' },
  })

  const onSubmit: SubmitHandler<AssignFormValues> = async (values) => {
    await onAssign(values)
    reset()
  }

  return (
    <ClosableModal
      open={isOpen}
      onClose={onClose}
      title="Назначить объект менеджеру"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <ModalBody>
          <div className={adminStyles.formFields}>
            <div className={adminStyles.selectWrapper}>
              <label className={adminStyles.selectLabel}>Менеджер</label>
              <select
                className={`${adminStyles.select} ${errors.userId ? adminStyles.selectError : ''}`}
                {...register('userId')}
              >
                <option value="">Выберите менеджера</option>
                {managers.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.email})
                  </option>
                ))}
              </select>
              <Show when={errors.userId}>
                <span className={adminStyles.errorText}>
                  {errors.userId?.message}
                </span>
              </Show>
            </div>
            <div className={adminStyles.selectWrapper}>
              <label className={adminStyles.selectLabel}>Объект</label>
              <select
                className={`${adminStyles.select} ${errors.propertyId ? adminStyles.selectError : ''}`}
                {...register('propertyId')}
              >
                <option value="">Выберите объект</option>
                {properties.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title} — {p.address}
                  </option>
                ))}
              </select>
              <Show when={errors.propertyId}>
                <span className={adminStyles.errorText}>
                  {errors.propertyId?.message}
                </span>
              </Show>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button view="ghost" label="Отмена" onClick={onClose} type="button" />
          <Button view="primary" label="Назначить" type="submit" />
        </ModalFooter>
      </form>
    </ClosableModal>
  )
}
