import React, { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/outline";
import { classNames } from "@/utils/classname";
import { FileDetail } from "./FileDetail";
import { FileCommentForm } from "./FileCommentForm";
import { FileCommentList } from "./FileCommentList";
import { useFile } from "@/swr/file.swr";
import { useStore } from "effector-react";
import { $fileActions, $slideFile } from "@/store/file.store";
import { FileSliderProvider } from "@/context/file-slider.context";
import Router, { useRouter } from "next/router";
import { $object } from "@/utils/object";

interface Props {
  open?: boolean;
  onClose?: (value: boolean) => any;
  onDelete?: (fileID: any) => any;
  allowDelete?: boolean;
  onUpdate?: (file: any) => any;
  defaultTab?: string;
}

const tabs = [{ name: "Details" }, { name: "Comments" }];

/**
 * Todo, use context / provider
 */
export const FileSlider: React.FC<Props> = ({
  onClose,
  onDelete,
  open,
  allowDelete,
  onUpdate,
  defaultTab
}) => {
  const router = useRouter();
  const file = useStore<any>($slideFile);
  const [currentTab, setCurrentTab] = useState<string>(defaultTab || "Details");

  const [fetchFile, , , mutate] = useFile(file?.id);

  const closeModal = () => {
    $fileActions.setSlideFile(null);

    if (onClose) {
      onClose(false);
    }
  };

  const changeTab = (tabName: string) => () => setCurrentTab(tabName);

  const show = React.useMemo(() => {
    if (typeof open !== "undefined") {
      return open;
    }

    return !!file;
  }, [open, file]);

  useEffect(() => {
    // no validation for now
    const commentQuery = router.query.comment;
    if (open && !!commentQuery) {
      Router.replace({
        pathname: Router.pathname,
        query: $object(Router.query).except(["comment"])
      })
    }
  }, [open, router.query.comment]);

  return (
    <FileSliderProvider value={{ allowDelete, onDelete, onUpdate }}>
      <Transition.Root show={show} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-in-out duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in-out duration-500"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-[40rem] w-full pl-10">
                <Transition.Child
                  as={Fragment}
                  enter="transform transition ease-in-out duration-500"
                  enterFrom="translate-x-full"
                  enterTo="translate-x-0"
                  leave="transform transition ease-in-out duration-500"
                  leaveFrom="translate-x-0"
                  leaveTo="translate-x-full"
                >
                  <Dialog.Panel className="pointer-events-auto w-full">
                    <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                      <div className="px-4 sm:px-10 py-3.5 bg-primary-1">
                        <div className="flex items-start justify-between">
                          <Dialog.Title className="text-xl font-medium text-white">
                            {file?.name}
                          </Dialog.Title>
                          <div className="ml-3 flex h-7 items-center">
                            <button
                              type="button"
                              className="rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                              onClick={closeModal}
                            >
                              <span className="sr-only">Close panel</span>
                              <XIcon className="h-6 w-6" aria-hidden="true" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {!!file && (
                        <div className="relative flex-1 px-4 sm:px-10 py-4 sm:py-8">
                          <div className="border-b border-gray-200">
                            <nav
                              className="-mb-px flex space-x-8"
                              aria-label="Tabs"
                            >
                              {tabs.map((tab) => (
                                <button
                                  key={tab.name}
                                  type="button"
                                  onClick={changeTab(tab.name)}
                                  className={classNames(
                                    tab.name === currentTab
                                      ? "border-indigo-500 text-natural-13"
                                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
                                    "py-4 px-1 text-center border-b-2 font-medium text-sm"
                                  )}
                                >
                                  {tab.name}
                                </button>
                              ))}
                            </nav>
                          </div>

                          {currentTab === "Details" ? (
                            <FileDetail />
                          ) : (
                            <div>
                              <FileCommentList
                                comments={fetchFile?.comments?.data || []}
                                onCommentAdded={mutate}
                              />
                              <FileCommentForm onCommentAdded={mutate} />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </FileSliderProvider>
  );
};

FileSlider.defaultProps = {
  onClose: () => {},
  allowDelete: false,
};
