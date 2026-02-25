import { useState } from 'react'
import { Box, IconButton } from '@chakra-ui/react'
import { DeleteIcon } from '@chakra-ui/icons'
import type { Manager } from '@/shared/types'

interface RemoveManagerCellProps {
  row: { original: Manager }
  onDelete: (id: string, name: string) => Promise<void>
}

export const RemoveManagerCell: React.FC<RemoveManagerCellProps> = ({
  row,
  onDelete,
}) => {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleClick = async (): Promise<void> => {
    setIsDeleting(true)
    try {
      await onDelete(row.original.id, row.original.name)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Box display="flex" justifyContent="flex-end">
      <IconButton
        aria-label="Удалить"
        icon={<DeleteIcon />}
        size="sm"
        variant="ghost"
        isLoading={isDeleting}
        onClick={handleClick}
      />
    </Box>
  )
}
