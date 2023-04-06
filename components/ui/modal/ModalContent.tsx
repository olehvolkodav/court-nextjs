import React, { Fragment } from "react";
import { Transition, Dialog } from "@headlessui/react";

export interface IModalContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const ModalContent: React.FC<IModalContentProps> = ({children, ...rest}) => {
  return (
    <Transition.Child
      as={Fragment}
      enter="ease-out duration-300"
      enterFrom="opacity-0 scale-95"
      enterTo="opacity-100 scale-100"
      leave="ease-in duration-200"
      leaveFrom="opacity-100 scale-100"
      leaveTo="opacity-0 scale-95"
    >
      <Dialog.Panel {...rest}>
        {children}
      </Dialog.Panel>
    </Transition.Child>
  )
}

ModalContent.defaultProps = {
  className: "w-full max-w-xl transform overflow-hidden rounded-lg bg-white text-left align-middle shadow-xl transition-all"
}
