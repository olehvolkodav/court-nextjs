import React, { Fragment } from "react";
import { Transition } from "@headlessui/react";

export const ModalBackdrop: React.FC = () => {
  return(
    <Transition.Child
      as={Fragment}
      enter="ease-out duration-300"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="ease-in duration-200"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div className="fixed inset-0 bg-gray-800 bg-opacity-60 transition-opacity opacity-100" />
    </Transition.Child>
  )
}
