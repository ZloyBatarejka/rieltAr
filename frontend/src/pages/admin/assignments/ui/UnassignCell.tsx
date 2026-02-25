import { useState } from 'react'
import { Box, IconButton } from '@chakra-ui/react'
import { CloseIcon } from '@chakra-ui/icons'
import type { Assignment } from '@/shared/types'

interface UnassignCellProps {
  row: { original: Assignment }
  onUnassign: (id: string, propertyTitle: string) => Promise<void>
}

export const UnassignCell: React.FC<UnassignCellProps> = ({
  row,
  onUnassign,
}) => {
  const [isRemoving, setIsRemoving] = useState(false)

  const handleClick = async () => {
    setIsRemoving(true)
    try {
      await onUnassign(row.original.id, row.original.propertyTitle)
    } finally {
      setIsRemoving(false)
    }
  }

  return (
    <Box display="flex" justifyContent="flex-end">
      <IconButton
        aria-label="Снять назначение"
        icon={<CloseIcon />}
        size="sm"
        variant="ghost"
        isLoading={isRemoving}
        onClick={handleClick}
      />
    </Box>
  )
}
