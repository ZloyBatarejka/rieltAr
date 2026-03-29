import { type ReactElement, useEffect } from 'react'
import { createStayStore } from './model/create-stay.store'
import { CreateStayForm } from './ui/CreateStayForm'

export function CreateStayPage(): ReactElement {
  useEffect(() => {
    void createStayStore.fetchProperties()
  }, [])

  return <CreateStayForm />
}
