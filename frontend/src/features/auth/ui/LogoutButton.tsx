import { type ReactElement } from 'react'
import { useNavigate } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { Button } from '@consta/uikit/Button'
import { authStore } from '../../../entities/auth'

const LogoutButton = observer(function LogoutButton(): ReactElement {
  const navigate = useNavigate()

  const handleLogout = (): void => {
    void authStore.logout().then(() => {
      navigate('/login', { replace: true })
    })
  }

  return (
    <Button
      view="ghost"
      size="s"
      label="Выйти"
      onClick={handleLogout}
    />
  )
})

export default LogoutButton
