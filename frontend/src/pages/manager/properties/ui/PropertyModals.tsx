import { type ReactElement } from 'react'
import { observer } from 'mobx-react-lite'
import { authStore } from '@/entities/auth'
import { Show } from '@/shared/ui/Show'
import { managerPropertiesStore } from '../model/manager-properties.store'
import { AddPropertyModal } from './AddPropertyModal'
import { EditPropertyModal } from './EditPropertyModal'

export const PropertyModals = observer(
  function PropertyModals(): ReactElement | null {
    const canManage = authStore.user?.canCreateProperties === true

    return (
      <Show when={canManage}>
        <AddPropertyModal
          isOpen={managerPropertiesStore.isAddModalOpen}
          onClose={() => managerPropertiesStore.closeAddModal()}
          onAdd={(v) => managerPropertiesStore.addProperty(v)}
          owners={managerPropertiesStore.owners}
        />
        <Show when={managerPropertiesStore.editingProperty}>
          {(property) => (
            <EditPropertyModal
              isOpen={managerPropertiesStore.isEditModalOpen}
              onClose={() => managerPropertiesStore.closeEditModal()}
              onSave={(v) =>
                managerPropertiesStore.updateProperty(property.id, v)
              }
              property={property}
              owners={managerPropertiesStore.owners}
            />
          )}
        </Show>
      </Show>
    )
  },
)
