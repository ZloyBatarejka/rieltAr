import { type ReactElement } from 'react'
import {
  Button,
  FormControl,
  FormErrorMessage,
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
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreatePropertyFormValues>({
    resolver: zodResolver(createPropertySchema),
    defaultValues: { title: '', address: '', ownerId: '' },
  })

  const onSubmit: SubmitHandler<CreatePropertyFormValues> = async (values) => {
    await onAdd(values)
    reset()
  }

  return (
    <ClosableModal isOpen={isOpen} onClose={onClose} title="Добавить объект">
      <form onSubmit={handleSubmit(onSubmit)}>
        <ModalBody>
          <VStack spacing={4} align="stretch">
            <FormControl isInvalid={!!errors.title} isRequired>
              <Input {...register('title')} placeholder="Название" />
              <FormErrorMessage>{errors.title?.message}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.address} isRequired>
              <Input {...register('address')} placeholder="Адрес" />
              <FormErrorMessage>{errors.address?.message}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.ownerId} isRequired>
              <Select {...register('ownerId')} placeholder="Собственник">
                {owners.map((owner) => (
                  <option key={owner.id} value={owner.id}>
                    {owner.name}
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
