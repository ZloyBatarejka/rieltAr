import { useState } from 'react'
import { Button } from '@consta/uikit/Button'
import { IconTrash } from '@consta/icons/IconTrash'
import type { Assignment } from '@/shared/types'
import adminStyles from '../../admin.module.css'

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
    <div className={adminStyles.actionsEnd}>
      <Button
        size="s"
        view="ghost"
        onlyIcon
        iconLeft={IconTrash}
        loading={isRemoving}
        onClick={handleClick}
        aria-label="Снять назначение"
      />
    </div>
  )
}
