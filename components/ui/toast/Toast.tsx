import React, { Fragment } from "react"
import { Transition } from "@headlessui/react"
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/outline"
import { XIcon } from "@heroicons/react/solid"
import { ToastMessage } from "./toast.interface"
import { $toastActions } from "@/store/toast.store"
import { classNames } from "@/utils/classname"
import { Icon } from "../Icon"

interface Props {
  message: ToastMessage;
}

export const Toast: React.FC<Props> = ({message}) => {
  const [ show, setShow ] = React.useState(false);

  const removeToast = React.useCallback(() => {
    setShow(false);

    setTimeout(() => {
      $toastActions.removeToast(message.id);
    }, 100);
  }, [message.id]);

  React.useEffect(() => {
    setShow(true);

    const timer = setTimeout(() => {
      removeToast();
    }, 5000);

    return () => {
      clearTimeout(timer)
    }
  }, [removeToast]);

  return (
    <Transition
      show={show}
      as={Fragment}
      enter="transform ease-out duration-300 transition"
      enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
      enterTo="translate-y-0 opacity-100 sm:translate-x-0"
      leave="transition ease-in duration-100"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div
        id={message.id}
        className={classNames(
          "max-w-sm w-full text-white rounded-full pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden",
          message.status === "error" ? "bg-red-500" : "bg-black"
        )}
      >
        <div className="p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <Icon
                className={classNames(
                  "h-6 w-6",
                  message.status === "error" ? "text-red-100" : "text-green-400"
                )}
                as={message.status === "error" ? XCircleIcon : CheckCircleIcon}
                aria-hidden="true"
              />
            </div>
            <div className="ml-3 w-0 flex-1 pt-0.5 space-y-1">
              {!!message.title && <p className="text-sm font-medium text-white">{message.title}</p>}
              <p className="text-sm text-white">{message.message}</p>
            </div>
            <div className="ml-4 flex-shrink-0 flex">
              <button
                className="rounded-md inline-flex text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                onClick={removeToast}
              >
                <span className="sr-only">Close</span>
                <XIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  )
}
