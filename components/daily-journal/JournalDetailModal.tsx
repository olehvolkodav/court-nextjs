import React, {Fragment} from "react";
import {Dialog, Transition} from "@headlessui/react";
import {ModalProps} from "@/interfaces/modal.props";
import {XIcon} from "@heroicons/react/outline";
import { Badge } from "../ui/Badge";
import { $date } from "@/plugins/date";

interface Props extends ModalProps {
  // journal props can be from journal, event, or task model/api
  journal: any;
}

export const JournalDetailModal: React.FC<Props> = ({isOpen, onClose, journal}) => {
  const closeModal = () => {
    if (onClose) {
      onClose(false)
    }
  }


  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-800 bg-opacity-60 transition-opacity opacity-100"/>
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel
                className="w-full max-w-xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all"
              >
                {!!journal && (
                  <>
                    <div className="flex justify-between">
                      <Dialog.Title
                        as="h3"
                        className="text-lg font-medium leading-6 text-gray-800 mb-4"
                      >
                        {journal.title}
                      </Dialog.Title>

                      <button type="button" className="h-6 w-6 text-gray-700 hover:text-gray-800" onClick={closeModal}>
                        <XIcon/>
                      </button>
                    </div>

                    <dl className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                      <div>
                        <dt className="text-sm font-medium text-gray-700">Type</dt>
                      </div>

                      <div className="lg:col-span-2">
                        <dd className="text-sm text-gray-900">
                          <Badge>{journal.__typename.replace("Court", "")}</Badge>
                        </dd>
                      </div>

                      <div>
                        <dt className="text-sm font-medium text-gray-700">Due Date</dt>
                      </div>

                      <div className="lg:col-span-2">
                        <dd className="text-sm text-gray-900">
                          <Badge>
                            {$date(journal.date).format("DD MMMM YYYY")}
                          </Badge>
                        </dd>
                      </div>

                      {journal.__typename === "Task" && (
                        <>
                          <div>
                            <dt className="text-sm font-medium text-gray-700">Category</dt>
                          </div>

                          <div className="lg:col-span-2">
                            <dd className="text-sm text-gray-900 capitalize">
                              {journal.category}
                            </dd>
                          </div>
                        </>
                      )}

                      <div className="lg:col-span-3">
                        <div dangerouslySetInnerHTML={{__html: journal.description}} />
                      </div>
                    </dl>
                  </>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
