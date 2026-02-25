import { type ReactElement } from 'react'
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  ModalBody,
  ModalFooter,
  Select,
  VStack,
} from '@chakra-ui/react'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ClosableModal } from '@/shared/ui/ClosableModal'
import type { Owner } from '@/shared/types'

const createPropertySchema = z.object({
  title: z.string().min(1, 'Введите название'),
  address: z.string().min(1, 'Введите адрес'),
  ownerId: z.string().min(1, 'Выберите собственника'),
})

type CreatePropertyFormValues = z.infer<typeof createPropertySchema>

interface AddPropertyModalProps {
  isOpen: boolean
  onClose: () => void
  owners: Owner[]
  onAddProperty: (values: CreatePropertyFormValues) => Promise<void>
}

export function AddPropertyModal({
  isOpen,
  onClose,
  owners,
  onAddProperty,
}: AddPropertyModalProps): ReactElement {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreatePropertyFormValues>({
    resolver: zodResolver(createPropertySchema),
    defaultValues: { title: '', address: '', ownerId: '' },
  })

  const onSubmit: SubmitHandler<CreatePropertyFormValues> = async (values) => {
    await onAddProperty(values)
    reset()
  }

  return (
    <ClosableModal isOpen={isOpen} onClose={onClose} title="Добавить объект">
      <form onSubmit={handleSubmit(onSubmit)}>
        <ModalBody>
          <VStack spacing={4} align="stretch">
            <FormControl isInvalid={!!errors.title} isRequired>
              <FormLabel>Название</FormLabel>
              <Input
                {...register('title')}
                placeholder="Квартира на Тверской"
              />
              <FormErrorMessage>{errors.title?.message}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.address} isRequired>
              <FormLabel>Адрес</FormLabel>
              <Input
                {...register('address')}
                placeholder="ул. Тверская, д. 1"
              />
              <FormErrorMessage>{errors.address?.message}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.ownerId} isRequired>
              <FormLabel>Собственник</FormLabel>
              <Select
                {...register('ownerId')}
                placeholder="Выберите собственника"
              >
                {owners.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.name}
                  </option>
                ))}
              </Select>
              <FormErrorMessage>{errors.ownerId?.message}</FormErrorMessage>
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
