import { type ReactElement, useEffect } from 'react'
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
import type { Owner, Property } from '@/shared/types'

const editPropertySchema = z.object({
  title: z.string().min(1, 'Введите название'),
  address: z.string().min(1, 'Введите адрес'),
  ownerId: z.string().min(1, 'Выберите собственника'),
})

type EditPropertyFormValues = z.infer<typeof editPropertySchema>

interface EditPropertyModalProps {
  isOpen: boolean
  onClose: () => void
  property: Property | null
  owners: Owner[]
  onSave: (values: EditPropertyFormValues) => Promise<void>
}

export function EditPropertyModal({
  isOpen,
  onClose,
  property,
  owners,
  onSave,
}: EditPropertyModalProps): ReactElement {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EditPropertyFormValues>({
    resolver: zodResolver(editPropertySchema),
    defaultValues: { title: '', address: '', ownerId: '' },
  })

  useEffect(() => {
    if (isOpen && property) {
      reset({
        title: property.title,
        address: property.address,
        ownerId: property.ownerId,
      })
    }
  }, [isOpen, property, reset])

  const onSubmit: SubmitHandler<EditPropertyFormValues> = async (values) => {
    await onSave(values)
  }

  return (
    <ClosableModal
      isOpen={isOpen}
      onClose={onClose}
      title="Редактировать объект"
    >
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
            Сохранить
          </Button>
        </ModalFooter>
      </form>
    </ClosableModal>
  )
}
