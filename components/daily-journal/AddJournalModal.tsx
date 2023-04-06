import React, {Fragment} from "react";
import {Dialog, Transition} from "@headlessui/react";
import {ModalProps} from "@/interfaces/modal.props";
import {XIcon} from "@heroicons/react/outline";
import VoiceMemoIcon from "@/components/icons/VoiceMemoIcon";
import JournalEntry from "@/components/icons/JournalEntry";
import EventIcon from "@/components/icons/EventIcon";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import { classNames } from "@/utils/classname";
import { $theme } from "@/theme";
import { useCaseDashboard } from "@/hooks/case.hook";

interface Props extends ModalProps {
  setJournalModal: any
  setRecordModal: any
}

export const AddJournalModal: React.FC<Props> = ({isOpen, onClose, setJournalModal, setRecordModal}) => {
  const [courtCase] = useCaseDashboard();

  const closeModal = () => {
    if (onClose) {
      onClose(false)
    }
  }

  return (
    <>
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

          <div className="fixed inset-1 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <div className="flex justify-end">
                    <button type="button" className="h-6 w-6 text-gray-700 hover:text-gray-800" onClick={closeModal}>
                      <XIcon/>
                    </button>
                  </div>

                  <div className="flex justify-center">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-800 mb-8 mt-4"
                    >
                      Add Event, Journal Entry, and Voice Memo to The Calendar
                    </Dialog.Title>

                  </div>

                  <div className="space-y-4">
                    <ul role="list" className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
                      <li
                        className="col-span-1 flex flex-col bg-white rounded-lg shadow divide-y divide-gray-200 border"
                      >
                        <div className="flex-1 flex flex-col px-4 py-8">
                          <EventIcon/>
                          <h3 className="mt-6 text-gray-900 text-2xl text-left">{"Event"}</h3>
                          <dl className="mt-1">
                            <dd className="text-gray-500 text-sm">
                              Create an event an add it to your calendar
                            </dd>
                          </dl>

                          <Link href={`/dashboard/${courtCase.id}/events/create`}>
                            <a className={
                              classNames("ml-3 w-[120px] ml-0 mt-6", $theme.button())
                            }>
                              Create
                            </a>
                          </Link>
                        </div>
                      </li>
                      <li
                        className="col-span-1 flex flex-col bg-white rounded-lg shadow divide-y divide-gray-200 border"
                      >
                        <div className="flex-1 flex flex-col px-4 py-8">
                          <JournalEntry/>

                          <h3 className="mt-6 text-gray-900 text-2xl text-left">{"Journal Entry"}</h3>
                          <dl className="mt-1">
                            <dd className="text-gray-500 text-sm">
                              Jot down a quick note so you dont forget.
                            </dd>
                          </dl>
                          <Button type="button" onClick={() => setJournalModal(true)}
                            className="ml-3 w-[120px] ml-0 mt-6">
                            Create
                          </Button>
                        </div>
                      </li>
                      <li
                        className="col-span-1 flex flex-col bg-white rounded-lg shadow divide-y divide-gray-200 border"
                      >
                        <div className="flex-1 flex flex-col px-4 py-8">
                          <VoiceMemoIcon aria-hidden="true"/>
                          <h3 className="mt-6 text-gray-900 text-2xl text-left">{"Voice Memo"}</h3>
                          <dl className="mt-1">
                            <dd className="text-gray-500 text-sm">
                              Record a voice memo with automatic transcription.
                            </dd>
                          </dl>
                          <Button
                            type="button"
                            onClick={() => setRecordModal(true)}
                            className="ml-3 w-[120px] ml-0 mt-6"
                          >
                            Create
                          </Button>
                        </div>
                      </li>
                    </ul>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}
