import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createStayStore } from './create-stay.store'

const createStaySchema = z.object({
  propertyId: z.string().min(1, 'Выберите объект'),
  guestName: z.string().min(1, 'Введите имя гостя'),
  checkIn: z.string().min(1, 'Укажите дату заезда'),
  checkOut: z.string().min(1, 'Укажите дату выезда'),
  totalAmount: z
    .string()
    .min(1, 'Введите сумму')
    .refine((v) => Number(v) > 0, 'Сумма должна быть больше 0'),
  commissionPercent: z.string(),
  cleaningAmount: z.string(),
})

export type CreateStayFormValues = z.infer<typeof createStaySchema>

export function useCreateStayForm() {
  const navigate = useNavigate()

  const form = useForm<CreateStayFormValues>({
    resolver: zodResolver(createStaySchema),
    defaultValues: {
      propertyId: '',
      guestName: '',
      checkIn: '',
      checkOut: '',
      totalAmount: '',
      commissionPercent: '0',
      cleaningAmount: '0',
    },
  })

  const totalAmount = Number(form.watch('totalAmount')) || 0
  const commissionPercent = Number(form.watch('commissionPercent')) || 0
  const cleaningAmount = Number(form.watch('cleaningAmount')) || 0

  const onSubmit = form.handleSubmit(async (values) => {
    const commission = Number(values.commissionPercent) || 0
    const cleaning = Number(values.cleaningAmount) || 0
    const checkInIso = new Date(values.checkIn).toISOString()
    const checkOutIso = new Date(values.checkOut).toISOString()
    const ok = await createStayStore.createStay({
      propertyId: values.propertyId,
      guestName: values.guestName,
      checkIn: checkInIso,
      checkOut: checkOutIso,
      totalAmount: Number(values.totalAmount),
      commissionPercent: commission > 0 ? commission : undefined,
      cleaningAmount: cleaning > 0 ? cleaning : undefined,
    })
    if (ok) {
      navigate('/manager/bookings')
    }
  })

  return {
    register: form.register,
    control: form.control,
    errors: form.formState.errors,
    onSubmit,
    preview: { totalAmount, commissionPercent, cleaningAmount },
  }
}
