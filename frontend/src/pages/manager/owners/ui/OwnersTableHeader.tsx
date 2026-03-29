import { type ReactElement } from 'react'
import { observer } from 'mobx-react-lite'
import { TextField } from '@consta/uikit/TextField'
import { Button } from '@consta/uikit/Button'
import { IconAdd } from '@consta/icons/IconAdd'
import { IconSearchStroked } from '@consta/icons/IconSearchStroked'
import { authStore } from '@/entities/auth'
import { Show } from '@/shared/ui/Show'
import { managerOwnersStore } from '../model/manager-owners.store'
import styles from './OwnersTableHeader.module.css'

const SearchIcon = () => <IconSearchStroked />

export const OwnersTableHeader = observer(
  function OwnersTableHeader(): ReactElement {
    const canCreate = authStore.user?.canCreateOwners === true

    return (
      <div className={styles.row}>
        <TextField
          className={styles.searchField}
          size="s"
          placeholder="Поиск по имени…"
          value={managerOwnersStore.search}
          onChange={(v) => managerOwnersStore.setSearch(v ?? '')}
          leftSide={SearchIcon}
        />
        <Show when={canCreate}>
          <Button
            size="s"
            view="primary"
            onlyIcon
            iconLeft={IconAdd}
            onClick={() => managerOwnersStore.openModal()}
          />
        </Show>
      </div>
    )
  },
)
