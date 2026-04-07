import type { ReactElement } from 'react'
import { DatePicker } from '@consta/uikit/DatePicker'
import { Select } from '@consta/uikit/Select'
import { Button } from '@consta/uikit/Button'
import { Show } from '@/shared/ui/Show'
import styles from './RecordsFilters.module.css'

export interface RecordsFiltersSelectItem {
  id: string
  label: string
}

interface RecordsFiltersProps {
  ownerItems?: RecordsFiltersSelectItem[]
  ownerId?: Nullable<string>
  onOwnerChange?: (ownerId: Nullable<string>) => void
  ownerLabel?: string
  ownerPlaceholder?: string

  propertyItems: RecordsFiltersSelectItem[]
  propertyId: Nullable<string>
  onPropertyChange: (propertyId: Nullable<string>) => void
  propertyLabel?: string
  propertyPlaceholder?: string

  typeItems?: RecordsFiltersSelectItem[]
  typeId?: Nullable<string>
  onTypeChange?: (typeId: Nullable<string>) => void
  typeLabel?: string
  typePlaceholder?: string

  from: Nullable<Date>
  to: Nullable<Date>
  onFromChange: (from: Nullable<Date>) => void
  onToChange: (to: Nullable<Date>) => void

  onReset: () => void
  onApply: () => void
}

export const RecordsFilters = ({
  ownerItems,
  ownerId,
  onOwnerChange,
  ownerLabel = 'Собственник',
  ownerPlaceholder = 'Не выбран',

  propertyItems,
  propertyId,
  onPropertyChange,
  propertyLabel = 'Объект',
  propertyPlaceholder = 'Все объекты',

  typeItems,
  typeId,
  onTypeChange,
  typeLabel = 'Тип',
  typePlaceholder = 'Все типы',

  from,
  to,
  onFromChange,
  onToChange,

  onReset,
  onApply,
}: RecordsFiltersProps): ReactElement => {
  const selectedOwnerItem: RecordsFiltersSelectItem | null =
    ownerId === undefined || ownerId === null
      ? null
      : (ownerItems?.find((i) => i.id === ownerId) ?? null)

  const selectedPropertyItem: RecordsFiltersSelectItem | null =
    propertyId === null ? null : (propertyItems.find((i) => i.id === propertyId) ?? null)

  const selectedTypeItem: RecordsFiltersSelectItem | null =
    typeItems === undefined || typeId === undefined || typeId === null
      ? null
      : (typeItems.find((i) => i.id === typeId) ?? null)

  return (
    <div className={styles.filters}>
      <Show when={ownerItems !== undefined && onOwnerChange !== undefined && ownerId !== undefined}>
        <div className={styles.filterField}>
          <Select<RecordsFiltersSelectItem>
            size="s"
            items={ownerItems ?? []}
            value={selectedOwnerItem}
            onChange={(item) => onOwnerChange?.(item?.id ?? null)}
            getItemLabel={(i) => i.label}
            getItemKey={(i) => i.id}
            label={ownerLabel}
            labelPosition="top"
            placeholder={ownerPlaceholder}
          />
        </div>
      </Show>

      <div className={styles.filterField}>
        <Select<RecordsFiltersSelectItem>
          size="s"
          items={propertyItems}
          value={selectedPropertyItem}
          onChange={(item) => onPropertyChange(item?.id ?? null)}
          getItemLabel={(i) => i.label}
          getItemKey={(i) => i.id}
          label={propertyLabel}
          labelPosition="top"
          placeholder={propertyPlaceholder}
        />
      </div>

      <Show when={typeItems !== undefined && onTypeChange !== undefined && typeId !== undefined}>
        <div className={styles.filterField}>
          <Select<RecordsFiltersSelectItem>
            size="s"
            items={typeItems ?? []}
            value={selectedTypeItem}
            onChange={(item) => onTypeChange?.(item?.id ?? null)}
            getItemLabel={(i) => i.label}
            getItemKey={(i) => i.id}
            label={typeLabel}
            labelPosition="top"
            placeholder={typePlaceholder}
          />
        </div>
      </Show>

      <div className={styles.filterField}>
        <DatePicker
          type="date"
          size="s"
          labelPosition="top"
          label="Период с"
          value={from}
          onChange={(d) => onFromChange(d)}
        />
      </div>

      <div className={styles.filterField}>
        <DatePicker
          type="date"
          size="s"
          labelPosition="top"
          label="по"
          value={to}
          onChange={(d) => onToChange(d)}
        />
      </div>

      <div className={styles.filterActions}>
        <Button size="s" view="ghost" label="Сбросить" onClick={onReset} />
        <Button size="s" view="primary" label="Применить" onClick={onApply} />
      </div>
    </div>
  )
}

