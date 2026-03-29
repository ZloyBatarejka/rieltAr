import { useState } from 'react'
import { Button } from '@consta/uikit/Button'
import { IconTrash } from '@consta/icons/IconTrash'
import type { Manager } from '@/shared/types'
import adminStyles from '../../admin.module.css'

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
    <div className={adminStyles.actionsEnd}>
      <Button
        size="s"
        view="ghost"
        onlyIcon
        iconLeft={IconTrash}
        loading={isDeleting}
        onClick={handleClick}
        aria-label="Удалить"
      />
    </div>
  )
}
