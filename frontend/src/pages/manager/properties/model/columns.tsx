import { HStack, IconButton } from '@chakra-ui/react'
import { EditIcon, DeleteIcon } from '@chakra-ui/icons'
import type { DataTableColumn } from '@/shared/ui/DataTable'
import type { Property } from '@/shared/types'

interface ColumnsParams {
  canManage: boolean
  onEdit: (property: Property) => void
  onDelete: (property: Property) => void
}

export function createPropertiesColumns({
  canManage,
  onEdit,
  onDelete,
}: ColumnsParams): DataTableColumn<Property>[] {
  const columns: DataTableColumn<Property>[] = [
    { header: 'Название', minW: '160px', render: (p) => p.title },
    { header: 'Адрес', minW: '200px', render: (p) => p.address },
    { header: 'Собственник', minW: '140px', render: (p) => p.ownerName },
  ]

  if (canManage) {
    columns.push({
      header: '',
      minW: '80px',
      render: (p) => (
        <HStack spacing={1}>
          <IconButton
            aria-label="Редактировать"
            icon={<EditIcon />}
            size="xs"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation()
              onEdit(p)
            }}
          />
          <IconButton
            aria-label="Удалить"
            icon={<DeleteIcon />}
            size="xs"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation()
              onDelete(p)
            }}
          />
        </HStack>
      ),
    })
  }

  return columns
}
