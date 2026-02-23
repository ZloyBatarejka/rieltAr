import { type ReactElement } from 'react'
import { useNavigate } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { Button } from '@chakra-ui/react'
import { authStore } from '../../../entities/auth'

const LogoutButton = observer(function LogoutButton(): ReactElement {
  const navigate = useNavigate()

  const handleLogout = (): void => {
    void authStore.logout().then(() => {
      navigate('/login', { replace: true })
    })
  }

  return (
    <Button variant="outline" colorScheme="red" size="sm" onClick={handleLogout}>
      Выйти
    </Button>
  )
})

export default LogoutButton
