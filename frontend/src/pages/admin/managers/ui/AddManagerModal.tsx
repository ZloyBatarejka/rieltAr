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
    register,
    handleSubmit,
    formState: { errors },
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
    <ClosableModal
      isOpen={isOpen}
      onClose={onClose}
      title="Добавить менеджера"
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
