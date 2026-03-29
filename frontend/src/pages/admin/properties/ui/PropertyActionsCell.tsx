import { useState } from 'react'
import { Button } from '@consta/uikit/Button'
import { IconEdit } from '@consta/icons/IconEdit'
import { IconTrash } from '@consta/icons/IconTrash'
import type { Property } from '@/shared/types'
import adminStyles from '../../admin.module.css'

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
    <div className={adminStyles.actionsRow}>
      <Button
        size="s"
        view="ghost"
        onlyIcon
        iconLeft={IconEdit}
        onClick={() => onEdit(row.original)}
        aria-label="Редактировать"
      />
      <Button
        size="s"
        view="ghost"
        onlyIcon
        iconLeft={IconTrash}
        loading={isDeleting}
        onClick={handleDelete}
        aria-label="Удалить"
      />
    </div>
  )
}
