import type { ReactNode, ReactElement } from 'react'
import { Modal } from '@consta/uikit/Modal'
import { ModalLayout } from '@consta/uikit/Modal'
import { Text } from '@consta/uikit/Text'
import { Button } from '@consta/uikit/Button'
import { IconClose } from '@consta/icons/IconClose'
import styles from './ClosableModal.module.css'

interface ClosableModalProps {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
}

function ClosableModalRoot({
  open,
  onClose,
  title,
  children,
}: ClosableModalProps): ReactElement {
  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      onClickOutside={onClose}
      onEsc={onClose}
      hasOverlay
      position="center"
      className={styles.modal}
    >
      <ModalLayout space={{ pH: 'xl', pV: 'l' }} border={[false, true]}>
        <div className={styles.header}>
          <Text as="h2" size="l" weight="bold" view="primary">{title}</Text>
          <Button
            size="xs"
            view="clear"
            onlyIcon
            iconLeft={IconClose}
            onClick={onClose}
            label="Закрыть"
          />
        </div>
      </ModalLayout>
      {children}
    </Modal>
  )
}

function Body({ children }: { children: ReactNode }): ReactElement {
  return (
    <ModalLayout space={{ pH: 'xl', pV: 'l' }}>
      {children}
    </ModalLayout>
  )
}

function Footer({ children }: { children: ReactNode }): ReactElement {
  return (
    <ModalLayout space={{ pH: 'xl', pV: 'm' }} border={[true, false]}>
      <div className={styles.footer}>
        {children}
      </div>
    </ModalLayout>
  )
}

export const ClosableModal = Object.assign(ClosableModalRoot, {
  Body,
  Footer,
})
