import { ModalProps } from "@/interfaces/modal.props";
import { Fragment, useCallback, useEffect, useMemo, useState } from "react"
import { Dialog, Transition } from "@headlessui/react"
import { ArrowLeftIcon, ChevronRightIcon, DocumentIcon, FolderIcon, XIcon } from "@heroicons/react/outline";
import { parsePage } from "@/graphql/query/util";
import { useRouter } from "next/router";
import { $gql, $http } from "@/plugins/http";
import { classNames } from "@/utils/classname";
import { Button } from "../ui/button";
import { Loading } from "../ui/loading";

interface Props extends ModalProps {
  /** File or folder to move */
  file?: any;
  onMoved?: (file: any) => any;
}

const ROOT_FOLDER_QUERY = `
  query($case: ID!) {
    courtCase: my_case(id: $case) {
      id
      folder {
        is_case_folder
        id
        name
        type
        children(orderBy: [{column: TYPE, order: DESC}]) {
          id
          name
          type
          is_case_folder
        }
      }
    }
  }
`

const SUB_FOLDER_QUERY = `
  query($id: ID!) {
    folder: my_file(id: $id) {
      is_case_folder
      id
      name
      type
      children(orderBy: [{column: TYPE, order: DESC}]) {
        id
        name
        type
      }
      parent {
        is_case_folder
        id
        name
      }
    }
  }
`

export const FileMoverModal: React.FC<Props> = ({ isOpen, onClose, file, onMoved }) => {
  const router = useRouter();

  const [folder, setFolder] = useState<any>();
  const [selectedFolder, setSelectedFolder] = useState<any>();
  const [activeFolderID, setActiveFolderID] = useState<string>();

  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);

  const isActiveOrSelected = useMemo(() => {
    return !!activeFolderID || !!selectedFolder?.id;
  }, [activeFolderID, selectedFolder?.id]);

  const headerName = useMemo(() => {
    if (selectedFolder?.is_case_folder) {
      return "My Files";
    }

    return selectedFolder?.name || "My Files";
  }, [selectedFolder]);

  const resetState = () => {
    setSelectedFolder(undefined);
    setActiveFolderID(undefined);
  }

  const closeModal = () => {
    if (onClose) {
      onClose(false);
    }

    resetState();
  }

  const onFolderClick = (item: any) => () => {
    // make sure its really folder
    if (item.type == "file") {
      return;
    }

    if (item.id === activeFolderID) {
      return setSelectedFolder(item)
    }

    setActiveFolderID(item.id);
  }

  const moveFile = async() => {
    setLoading(true);

    try {
      await $http.patch(`/files/${file.id}`, {
        folder_id: selectedFolder?.id ?? activeFolderID,
        type: "move",
      });

      resetState();

      if (onMoved) {
        onMoved(file);
      }
    } catch (error) {

    } finally {
      setLoading(false);
    }
  }

  const toParentFolder = () => {
    if (!folder?.parent) {
      return;
    }

    setSelectedFolder(folder?.parent);
  }

  const getFolder = useCallback(async () => {
    const caseID = parsePage(router.query.case);
    setLoaded(false);

    try {
      const data = await $gql({
        query: !selectedFolder?.id ? ROOT_FOLDER_QUERY : SUB_FOLDER_QUERY,
        variables: {
          case: caseID,
          id: selectedFolder?.id,
        }
      });

      if (!selectedFolder?.id) {
        setFolder(data?.courtCase?.folder);
      } else {
        setFolder(data?.folder);
      }

      setActiveFolderID(undefined);
    } catch (error) {
      //
    } finally {
      setLoaded(true);
    }
  }, [router.query.case, selectedFolder?.id])

  useEffect(() => {
    if (isOpen) {
      getFolder()
    }
  }, [getFolder, isOpen])

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
            <Dialog.Panel className="mx-auto max-w-2xl transform divide-y divide-gray-500 divide-opacity-10 overflow-hidden rounded-lg bg-white bg-opacity-80 shadow-2xl ring-1 ring-black ring-opacity-5 backdrop-blur backdrop-filter transition-all">
              <div className="px-4 py-2 flex justify-between">
                <div className="flex items-center">
                  {!folder?.is_case_folder && (
                    <button
                      className="text-gray-500 hover:text-primary-1"
                      onClick={toParentFolder}
                    >
                      <ArrowLeftIcon className="h-6 w-6 mr-3" />
                    </button>
                  )}

                  <span className="text-xl text-natural-13 font-medium">
                    {headerName}
                  </span>
                </div>

                <button type="button" onClick={closeModal}>
                  <XIcon className="h-6 w-6 text-gray-600" />
                </button>
              </div>

              <nav className="max-h-80 scroll-py-10 scroll-py-10 scroll-pb-2 scroll-pb-2 overflow-y-auto">
                {!loaded ? (
                  <div className="flex justify-center px-4 py-2">
                    <Loading />
                  </div>
                ) : (
                  <>
                    {!!folder?.children?.length ? (
                      folder?.children?.map((item: any) => (
                        <button
                          key={item.id}
                          className={classNames(
                            "disabled:text-gray-400 group text-sm w-full flex items-center justify-between px-4 py-2",
                            item.id === activeFolderID ? "bg-primary-1 text-white" : "text-gray-700",
                            item.type === "folder" && item.id !== activeFolderID && "hover:bg-gray-200"
                          )}
                          disabled={item.type === "file" || item.id == file?.id}
                          onClick={onFolderClick(item)}
                        >
                          <div className="flex items-center">
                            {item.type === "folder" ? (
                              <FolderIcon className="h-6 w-6" />
                            ) : (
                              <DocumentIcon className="h-6 w-6" />
                            )}

                            <span className="ml-3">{item.name}</span>
                          </div>

                          {(item.type === "folder" && item.id != file?.id) && (
                            <ChevronRightIcon
                              className={classNames(
                                "h-6 w-6",
                                item.id === activeFolderID ? "text-white" : "hidden group-hover:block"
                              )}
                            />
                          )}
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-6 text-center text-sm">
                        <p className="font-semibold text-gray-900">This folder is empty</p>
                      </div>
                    )}
                  </>
                )}
              </nav>

              <div className="flex justify-end px-4 py-2 bg-gray-50">
                <Button size="sm" disabled={!isActiveOrSelected} onClick={moveFile} isLoading={loading}>
                  Move Here
                </Button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
