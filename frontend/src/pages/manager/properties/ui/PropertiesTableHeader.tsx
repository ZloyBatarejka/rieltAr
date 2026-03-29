import { type ReactElement } from 'react'
import { observer } from 'mobx-react-lite'
import { TextField } from '@consta/uikit/TextField'
import { Button } from '@consta/uikit/Button'
import { IconAdd } from '@consta/icons/IconAdd'
import { IconSearchStroked } from '@consta/icons/IconSearchStroked'
import { authStore } from '@/entities/auth'
import { Show } from '@/shared/ui/Show'
import { managerPropertiesStore } from '../model/manager-properties.store'
import styles from './PropertiesTableHeader.module.css'

const SearchIcon = () => <IconSearchStroked />

export const PropertiesTableHeader = observer(
  function PropertiesTableHeader(): ReactElement {
    const canManage = authStore.user?.canCreateProperties === true

    return (
      <div className={styles.row}>
        <TextField
          className={styles.searchField}
          size="s"
          placeholder="Поиск по названию или адресу…"
          value={managerPropertiesStore.search}
          onChange={(v) => managerPropertiesStore.setSearch(v ?? '')}
          leftSide={SearchIcon}
        />
        <Show when={canManage}>
          <Button
            size="s"
            view="primary"
            onlyIcon
            iconLeft={IconAdd}
            onClick={() => managerPropertiesStore.openAddModal()}
          />
        </Show>
      </div>
    )
  },
)
