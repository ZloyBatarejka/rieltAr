import type { ReactNode, ReactElement } from 'react'
import { Modal } from '@consta/uikit/Modal'
import { ModalHeader } from '@consta/uikit/Modal'
import { ModalLayout } from '@consta/uikit/Modal'
import { Text } from '@consta/uikit/Text'
import styles from './ClosableModal.module.css'

interface ClosableModalProps {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
}

export function ClosableModal({
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
    >
      <ModalHeader onClose={onClose}>
        <Text as="h2" size="l" weight="bold" view="primary">{title}</Text>
      </ModalHeader>
      {children}
    </Modal>
  )
}

export function ModalBody({ children }: { children: ReactNode }): ReactElement {
  return (
    <ModalLayout space={{ pH: 'xl', pV: 'l' }}>
      {children}
    </ModalLayout>
  )
}

export function ModalFooter({ children }: { children: ReactNode }): ReactElement {
  return (
    <ModalLayout space={{ pH: 'xl', pV: 'm' }} border={[true, false]}>
      <div className={styles.footer}>
        {children}
      </div>
    </ModalLayout>
  )
}
