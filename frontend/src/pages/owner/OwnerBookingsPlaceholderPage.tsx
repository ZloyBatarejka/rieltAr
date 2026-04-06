import type { ReactElement } from 'react'
import { useSearchParams } from 'react-router-dom'
import { OwnerSectionPlaceholderPage } from './OwnerSectionPlaceholderPage'

export function OwnerBookingsPlaceholderPage(): ReactElement {
  const [searchParams] = useSearchParams()
  const propertyId = searchParams.get('propertyId')

  const hint =
    propertyId !== null
      ? 'Список заездов с фильтром по объекту появится здесь в следующей задаче (раздел «Заезды»).'
      : undefined

  return <OwnerSectionPlaceholderPage title="Заезды" hint={hint} />
}
