import { type ReactElement } from 'react'
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  ModalBody,
  ModalFooter,
  Select,
  VStack,
} from '@chakra-ui/react'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ClosableModal } from '@/shared/ui/ClosableModal'
import type { Manager, Property } from '@/shared/types'

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
      isOpen={isOpen}
      onClose={onClose}
      title="Назначить объект менеджеру"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <ModalBody>
          <VStack spacing={4} align="stretch">
            <FormControl isInvalid={!!errors.userId} isRequired>
              <FormLabel>Менеджер</FormLabel>
              <Select {...register('userId')} placeholder="Выберите менеджера">
                {managers.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.email})
                  </option>
                ))}
              </Select>
              <FormErrorMessage>{errors.userId?.message}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.propertyId} isRequired>
              <FormLabel>Объект</FormLabel>
              <Select {...register('propertyId')} placeholder="Выберите объект">
                {properties.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title} — {p.address}
                  </option>
                ))}
              </Select>
              <FormErrorMessage>{errors.propertyId?.message}</FormErrorMessage>
            </FormControl>
          </VStack>
        </ModalBody>
        <ModalFooter gap={3}>
          <Button variant="ghost" onClick={onClose} type="button">
            Отмена
          </Button>
          <Button colorScheme="blue" type="submit">
            Назначить
          </Button>
        </ModalFooter>
      </form>
    </ClosableModal>
  )
}
