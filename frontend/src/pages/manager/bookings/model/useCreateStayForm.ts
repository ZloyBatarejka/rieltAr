import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { authStore } from '@/entities/auth'
import { getCabinetBasePath } from '@/shared/lib/cabinetBasePath'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createStayStore } from './create-stay.store'

const createStaySchema = z
  .object({
    propertyId: z.string().min(1, 'Выберите объект'),
    guestName: z.string().min(1, 'Введите имя гостя'),
    checkIn: z.union([z.date(), z.null()]),
    checkOut: z.union([z.date(), z.null()]),
    totalAmount: z
      .string()
      .min(1, 'Введите сумму')
      .refine((v) => Number(v) > 0, 'Сумма должна быть больше 0'),
    commissionPercent: z.string(),
    cleaningAmount: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.checkIn === null) {
      ctx.addIssue({
        code: 'custom',
        message: 'Укажите дату заезда',
        path: ['checkIn'],
      })
    }
    if (data.checkOut === null) {
      ctx.addIssue({
        code: 'custom',
        message: 'Укажите дату выезда',
        path: ['checkOut'],
      })
    }
    if (
      data.checkIn !== null &&
      data.checkOut !== null &&
      data.checkOut.getTime() <= data.checkIn.getTime()
    ) {
      ctx.addIssue({
        code: 'custom',
        message: 'Дата выезда должна быть позже заезда',
        path: ['checkOut'],
      })
    }
  })

export type CreateStayFormValues = z.infer<typeof createStaySchema>

export function useCreateStayForm() {
  const navigate = useNavigate()

  const form = useForm<CreateStayFormValues>({
    resolver: zodResolver(createStaySchema),
    defaultValues: {
      propertyId: '',
      guestName: '',
      checkIn: null,
      checkOut: null,
      totalAmount: '',
      commissionPercent: '0',
      cleaningAmount: '0',
    },
  })

  const totalAmount = Number(form.watch('totalAmount')) || 0
  const commissionPercent = Number(form.watch('commissionPercent')) || 0
  const cleaningAmount = Number(form.watch('cleaningAmount')) || 0

  const onSubmit = form.handleSubmit(async (values) => {
    if (values.checkIn === null || values.checkOut === null) return

    const commission = Number(values.commissionPercent) || 0
    const cleaning = Number(values.cleaningAmount) || 0
    const ok = await createStayStore.createStay({
      propertyId: values.propertyId,
      guestName: values.guestName,
      checkIn: values.checkIn.toISOString(),
      checkOut: values.checkOut.toISOString(),
      totalAmount: Number(values.totalAmount),
      commissionPercent: commission > 0 ? commission : undefined,
      cleaningAmount: cleaning > 0 ? cleaning : undefined,
    })
    if (ok) {
      const u = authStore.user
      if (u) {
        navigate(`${getCabinetBasePath(u.role)}/bookings`)
      }
    }
  })

  return {
    control: form.control,
    errors: form.formState.errors,
    onSubmit,
    preview: { totalAmount, commissionPercent, cleaningAmount },
  }
}
