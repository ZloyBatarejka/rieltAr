import { Button } from '@consta/uikit/Button'
import { IconEdit } from '@consta/icons/IconEdit'
import { IconTrash } from '@consta/icons/IconTrash'
import type { DataTableColumn } from '@/shared/ui/DataTable'
import type { Property } from '@/shared/types'
import styles from './columns.module.css'

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
    { header: 'Название', minW: '200px', render: (p) => p.title },
    { header: 'Адрес', minW: '260px', render: (p) => p.address },
    { header: 'Собственник', minW: '180px', render: (p) => p.ownerName },
  ]

  if (canManage) {
    columns.push({
      header: '',
      minW: '80px',
      render: (p) => (
        <div className={styles.actions}>
          <Button
            size="xs"
            view="ghost"
            onlyIcon
            iconLeft={IconEdit}
            onClick={(e) => {
              e.stopPropagation()
              onEdit(p)
            }}
          />
          <Button
            size="xs"
            view="ghost"
            onlyIcon
            iconLeft={IconTrash}
            onClick={(e) => {
              e.stopPropagation()
              onDelete(p)
            }}
          />
        </div>
      ),
    })
  }

  return columns
}
