import type { ReactNode } from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
} from '@chakra-ui/react'

interface ClosableModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ReactNode
}

export const ClosableModal: React.FC<ClosableModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
}) => (
  <Modal isOpen={isOpen} onClose={onClose}>
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>{title}</ModalHeader>
      <ModalCloseButton />
      {children}
    </ModalContent>
  </Modal>
)
