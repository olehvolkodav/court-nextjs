import React, { Fragment } from "react";
import { ModalProps } from "@/interfaces/modal.props";
import { Transition, Dialog } from "@headlessui/react";
import { ModalBackdrop } from "./ModalBackdrop";
import { ModalContent } from "./ModalContent";

interface ModalPropsWithChildren extends ModalProps {
  children: React.ReactNode;
  initialFocus?: React.MutableRefObject<HTMLElement | null> | undefined;
}

type ModalComponent = React.FunctionComponent<ModalPropsWithChildren> & {
  Backdrop: typeof ModalBackdrop;
  Content: typeof ModalContent;
};

export const Modal: ModalComponent = ({isOpen, children, onClose, initialFocus}) => {
  const closeModal = () => {
    if (onClose) {
      onClose(false)
    }
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeModal} initialFocus={initialFocus}>
        {children}
      </Dialog>
    </Transition>
  )
}

Modal.Backdrop = ModalBackdrop;
Modal.Content = ModalContent;

Modal.defaultProps = {
  isOpen: false,
  onClose: () => {}
}
