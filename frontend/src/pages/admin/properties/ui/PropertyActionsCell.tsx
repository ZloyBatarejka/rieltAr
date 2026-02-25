import { useState } from 'react'
import { Box, IconButton } from '@chakra-ui/react'
import { DeleteIcon, EditIcon } from '@chakra-ui/icons'
import type { Property } from '@/shared/types'

interface PropertyActionsCellProps {
  row: { original: Property }
  onEdit: (prop: Property) => void
  onDelete: (id: string, title: string) => Promise<void>
}

export const PropertyActionsCell: React.FC<PropertyActionsCellProps> = ({
  row,
  onEdit,
  onDelete,
}) => {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await onDelete(row.original.id, row.original.title)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Box display="flex" gap={2} justifyContent="flex-end">
      <IconButton
        aria-label="Редактировать"
        icon={<EditIcon />}
        size="sm"
        variant="ghost"
        onClick={() => onEdit(row.original)}
      />
      <IconButton
        aria-label="Удалить"
        icon={<DeleteIcon />}
        size="sm"
        variant="ghost"
        isLoading={isDeleting}
        onClick={handleDelete}
      />
    </Box>
  )
}
