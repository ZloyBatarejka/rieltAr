import { type ReactElement } from 'react'
import {
  Button,
  FormControl,
  FormErrorMessage,
  Input,
  ModalBody,
  ModalFooter,
  VStack,
} from '@chakra-ui/react'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ClosableModal } from '@/shared/ui/ClosableModal'

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
    register,
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
      isOpen={isOpen}
      onClose={onClose}
      title="Добавить собственника"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <ModalBody>
          <VStack spacing={4} align="stretch">
            <FormControl isInvalid={!!errors.email} isRequired>
              <Input {...register('email')} type="email" placeholder="Email" />
              <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.password} isRequired>
              <Input
                {...register('password')}
                type="password"
                placeholder="Пароль"
              />
              <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.name} isRequired>
              <Input {...register('name')} placeholder="Имя" />
              <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.phone}>
              <Input {...register('phone')} placeholder="Телефон (необязательно)" />
              <FormErrorMessage>{errors.phone?.message}</FormErrorMessage>
            </FormControl>
          </VStack>
        </ModalBody>
        <ModalFooter gap={3}>
          <Button variant="ghost" onClick={onClose} type="button">
            Отмена
          </Button>
          <Button colorScheme="blue" type="submit">
            Создать
          </Button>
        </ModalFooter>
      </form>
    </ClosableModal>
  )
}
