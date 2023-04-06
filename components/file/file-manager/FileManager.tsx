import React, { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { ModalProps } from "@/interfaces/modal.props";
import { useFileManager } from "@/context/file-manager.context";
import { XIcon } from "@heroicons/react/outline";
import { classNames } from "@/utils/classname";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/ui/file-upload/FileUpload";
import { MyFile } from "./MyFile";

const tabs = [
  { name: "Selected Files"},
  { name: "Upload"},
  { name: "My Files"},
]

interface IFileManagerProps extends ModalProps {
  onSelect?: (files: any[]) => any;
}

export const FileManager: React.FC<IFileManagerProps> = ({isOpen}) => {
  const [state, dispatch] = useFileManager();
  const [currentTab, setCurrentTab] = useState("Upload");
  const [files, setFiles] = useState<any[]>([]);

  const closeModal = () => {
    dispatch({
      type: "modal",
      value: false,
    })
  }

  const handleTabChange = (tab: string) => () => {
    setCurrentTab(tab);
  }

  return (
    <Transition.Root show={isOpen} as={Fragment} appear>
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
          <div className="fixed inset-0 bg-gray-500 bg-opacity-25 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto p-4 sm:p-6 md:p-20">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="mx-auto max-w-screen-lg transform divide-y divide-gray-100 overflow-hidden rounded-lg bg-white shadow-2xl ring-1 ring-black ring-opacity-5 transition-all">
              <div>
                <div className="flex justify-between items-center p-3">
                  <h2 className="text-2xl font-medium">File Manager</h2>

                  <button type="button" className="h-6 w-6 text-gray-500" onClick={closeModal}>
                    <XIcon />
                  </button>
                </div>

                <div className="border-b">
                  <nav className="-mb-px flex" aria-label="Tabs">
                    {tabs.map((tab) => (
                      <button
                        key={tab.name}
                        type="button"
                        onClick={handleTabChange(tab.name)}
                        className={classNames(
                          tab.name === currentTab
                            ? "border-indigo-500 text-indigo-600"
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
                          "whitespace-nowrap py-4 px-4 border-b-2 font-medium text-sm"
                        )}
                        aria-current={tab.name === currentTab ? "page" : undefined}
                      >
                        {tab.name}
                      </button>
                    ))}
                  </nav>
                </div>
              </div>

              <div className="max-h-96 scroll-py-3 overflow-y-auto p-3">
                {currentTab === "Upload" && <FileUpload />}

                {currentTab === "My Files" && <MyFile />}
              </div>

              <div className="border-t p-3">
                <Button disabled={!files.length}>
                  Select {files.length} files
                </Button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

FileManager.defaultProps = {
  isOpen: false,
}
