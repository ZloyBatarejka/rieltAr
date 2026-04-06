import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Theme, presetGpnDefault } from '@consta/uikit/Theme'
import { AddOwnerModal } from './AddOwnerModal'

describe('AddOwnerModal', () => {
  const onClose = vi.fn()
  const onAddOwner = vi.fn().mockResolvedValue(undefined)

  beforeEach(() => {
    vi.clearAllMocks()
  })

  async function renderOpenModal(): Promise<ReturnType<typeof userEvent.setup>> {
    const user = userEvent.setup()
    render(
      <Theme preset={presetGpnDefault}>
        <AddOwnerModal isOpen onClose={onClose} onAddOwner={onAddOwner} />
      </Theme>,
    )
    return user
  }

  it('renders fields when open', async () => {
    await renderOpenModal()

    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Пароль')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Имя')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Создать' })).toBeInTheDocument()
  })

  it('shows validation error for short password on submit', async () => {
    const user = await renderOpenModal()

    await user.type(screen.getByPlaceholderText('Email'), 'owner@test.com')
    await user.type(screen.getByPlaceholderText('Пароль'), '12345')
    await user.type(screen.getByPlaceholderText('Имя'), 'Иван')
    await user.click(screen.getByRole('button', { name: 'Создать' }))

    await waitFor(() => {
      expect(screen.getByText('Минимум 6 символов')).toBeInTheDocument()
    })
    expect(onAddOwner).not.toHaveBeenCalled()
  })

  it('calls onAddOwner with form values on valid submit', async () => {
    const user = await renderOpenModal()

    await user.type(screen.getByPlaceholderText('Email'), 'owner@test.com')
    await user.type(screen.getByPlaceholderText('Пароль'), 'secret12')
    await user.type(screen.getByPlaceholderText('Имя'), 'Иван Петров')
    await user.type(
      screen.getByPlaceholderText('Телефон (необязательно)'),
      '+79990001122',
    )
    await user.click(screen.getByRole('button', { name: 'Создать' }))

    await waitFor(() => {
      expect(onAddOwner).toHaveBeenCalledWith({
        email: 'owner@test.com',
        password: 'secret12',
        name: 'Иван Петров',
        phone: '+79990001122',
      })
    })
  })

  it('calls onClose when Отмена is clicked', async () => {
    const user = await renderOpenModal()

    await user.click(screen.getByRole('button', { name: 'Отмена' }))

    expect(onClose).toHaveBeenCalled()
  })
})
