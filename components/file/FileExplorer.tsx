import React, { ChangeEventHandler, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { SortableContainer, SortableContainerProps, SortableElement, SortableElementProps, SortableHandle } from "react-sortable-hoc";
import { useStore } from "effector-react";
import {
  InformationCircleIcon,
  PlusIcon,
  ArrowRightIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  TrashIcon,
  DotsVerticalIcon
} from "@heroicons/react/outline";
import { FolderIcon,FolderAddIcon } from "@heroicons/react/solid";

import { FileSlider } from "@/components/file/FileSlider";
import GridIcon from "@/components/icons/GridIcon";
import ListIcon from "@/components/icons/ListIcon";
import { FileCover } from "@/components/file/FileCover";
import { NewFolderModal } from "@/components/file/NewFolderModal";
import { FileBreadcrumb } from "./FileBreadcrumb";
import { FileMoverModal } from "./FileMoverModal";
import { FilePreview } from "./file-explorer/FilePreview";

import { $date } from "@/plugins/date";
import { $gql, $http } from "@/plugins/http";
import { classNames } from "@/utils/classname";
import {
  formatBytes,
  getFile as _getFile,
} from "@/utils/file";
import { CASE_FOLDER_QUERY, SUB_FOLDER_QUERY } from "@/graphql/query/file";
import { $fileActions, $slideFile } from "@/store/file.store";
import { $theme } from "@/theme";
import { useUpload } from "@/hooks/upload.hook";
import { useCaseDashboard } from "@/hooks/case.hook";

const TABLE_HEADERS = [
  { title: "Folder Name", sortOptions: { dataType: "string", key: "title" } },
  { title: "Last Modified", sortOptions: { dataType: "string", key: "date" } },
  { title: "File Size", sortOptions: { dataType: "string", key: "size" } },
  { title: "" },
];

interface Props {
  isIndex?: boolean;
}
interface IChildren {
  children: any;
}

const DraggableContainer = SortableContainer<IChildren & SortableContainerProps>(({ children }) => children);
const DraggableItem = SortableElement<IChildren & SortableElementProps>(({ children }) => children);
const DraggableHandle = SortableHandle<IChildren>(({ children }) => children);

export const FileExplorer: React.FC<Props> = ({ isIndex }) => {
  const [courtCase] = useCaseDashboard();
  const router = useRouter();
  const { uploadFile } = useUpload();

  const [sort, setSort] = useState<{
    field: string;
    sortType: "asc" | "desc" | null;
  }>({ field: "", sortType: null });
  const [children, setChildren] = useState<any[]>([]);

  const selectedFile = useStore($slideFile);

  const [folder, setFolder] = useState<any>();
  const [folderModalOpen, setFolderModalOpen] = useState<boolean>(false);
  const [breadcrumbs, setBreadcrumbs] = useState<any[]>([]);
  const [shareFiles, setShareFiles] = useState<any[]>([]);
  const [viewType, setViewType] = useState<string>("list");

  const inputRef = useRef<HTMLInputElement>(null);

  const [sliderOpen, setSliderOpen] = useState(false);
  const [fileMoverOpen, setFileMoverOpen] = useState(false);

  const [loaded, setLoaded] = useState(false);

  const selectFile = (target: any) => {
    const fileID = target.dataset?.fileId;

    if (fileID) {
      let file = folder?.children.find((o: any) => o.id == fileID);

      if (!file && isIndex) {
        // try to check share files
        file = shareFiles.find((o: any) => o.id == fileID);
      }

      return file;
    }
  };

  const handleFileClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const file = selectFile(e.target);

    if (!!selectedFile && file?.id == selectedFile.id) {
      return file.type === "file"
        ? setSliderOpen(true)
        : router.push({
          pathname: `/dashboard/[case]/files/[id]`,
          query: {
            id: file.id,
            case: courtCase.id,
          },
        });
    }

    $fileActions.setSlideFile(file);
  };

  const openSlider = () => setSliderOpen(true);
  const openFolderModal = () => setFolderModalOpen(true);
  const openFileMoverModal = () => setFileMoverOpen(true);

  const getFile = React.useCallback(async () => {
    const id = router.query.id as string;

    try {
      const data = await $gql({
        query: isIndex ? CASE_FOLDER_QUERY : SUB_FOLDER_QUERY,
        variables: {
          id,
          case: router.query.case,
        },
      });

      setFolder(isIndex ? data.courtCase.folder : data.folder);
      setChildren(isIndex ? data.courtCase.folder.children : data.folder.children);

      setBreadcrumbs(data.folder.ancestors ?? []);

      if (data.share_files) {
        setShareFiles(data.share_files);
      }
    } catch (error) { }
  }, [router.query.id, router.query.case, isIndex]);

  const getFileWithoutBreadcrumb = (file?: any) => {
    getFile();

    if (!file) {
      setFolderModalOpen(false);
    }
  };

  const handleFileDelete = async (fileID: any) => {
    await $http.delete(`/files/${fileID}`);

    setSliderOpen(false);

    setFolder((prev: any) => ({
      ...prev,
      children: prev.children.filter((file: any) => file.id != fileID),
    }));

    $fileActions.setSlideFile(null);
    getFile();
  };

  const handleAddFileClick = () => {
    inputRef.current?.click();
  };

  const handleInputChange: ChangeEventHandler<HTMLInputElement> = async (e) => {
    if (e.target.files?.length) {
      for (let i = 0; i < e.target.files.length; i++) {
        uploadFile(e.target.files.item(i) as File, folder?.id).then((res) => {
          if (res) {
            getFile()
          }
        });
      }
    }
  };

  const toggleViewType = () => {
    setViewType((prev) => (prev === "grid" ? "list" : "grid"));
  };

  const handleFileMove = () => {
    setFileMoverOpen(false);
    getFile();
  }

  // arrow in file/folder list
  const handleArrowListClick = (file: any) => (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    $fileActions.setSlideFile(file);
    setFileMoverOpen(true);
  }

  useEffect(() => {
    getFile().then(() => setLoaded(true));
  }, [getFile]);

  useEffect(() => {
    const commentFileID = router.query.comment as string;

    if (loaded && !!commentFileID) {
      const file = folder?.children.find((o: any) => o.id == commentFileID);

      if (!!file) {
        $fileActions.setSlideFile(file);
        setSliderOpen(true)
      }
    }
  }, [loaded, router.query.comment, folder?.children]);

  const compare = (field: string, type: string | undefined) => (a: { name: any; created_at: any; size: any; }, b: { name: any; created_at: any; size: any; }) => {
    let leftValue: string | number | Date, rightValue: string | number | Date;
    switch (field) {
      case "title":
        leftValue = a.name;
        rightValue = b.name;
        break;
      case "date":
        leftValue = a.created_at;
        rightValue = b.created_at;
        break;
      case "size":
      default:
        leftValue = a.size;
        rightValue = b.size;
        break;
    }
    switch (type) {
      case "date":
        return new Date(leftValue).getTime() - new Date(rightValue).getTime();
      case "string":
      default:
        if (leftValue < rightValue) return -1;
        if (leftValue > rightValue) return 1;
        return 0;
    }
  };

  useEffect(() => {
    if (sort.field) {
      const copiedChildren = [...folder.children];
      const data = TABLE_HEADERS.find(
        (header) => header.sortOptions?.key === sort.field
      );
      if (data) {
        copiedChildren.sort(compare(sort.field, data.sortOptions?.dataType));
        if (sort.sortType === "desc") {
          copiedChildren.reverse();
        }
        setChildren([...copiedChildren]);
      }
    }
  }, [sort, folder?.children]);


  const handleSort = (field: string, sortType: any) => {
    setSort({ field, sortType });
  };

  const onSortEnd = async ({oldIndex /*drag index*/, newIndex /*drop index*/}) => {
    const data = [...children];
    const [removed] = data.splice(oldIndex, 1);
    data.splice(newIndex, 0, removed);
    setChildren(data);

    const draggedID = children[oldIndex].id;
    const droppedID = children[newIndex].id;
    //integrate api
    await $http.patch(`/files/${draggedID}`, {
      type: "order",
      swap_id: droppedID,
    });
  };

  return (
    <>
      <h1 className="sr-only">Subfolders</h1>

      <input
        type="file"
        className="sr-only"
        ref={inputRef}
        onChange={handleInputChange}
        multiple
      />

      <div className="py-4">
        <div className="container mx-auto h-full">
          <div className="flex mb-4 justify-between items-center px-4 flex-col md:flex-row">
            <div className="mb-3 md:mb-0">
              <FileBreadcrumb
                breadcrumbs={breadcrumbs}
                isIndex={isIndex}
                folder={folder}
              />
            </div>
            <div className="flex items-center space-x-3">
              {!!selectedFile && (
                <>
                  <button type="button" onClick={openSlider}>
                    <InformationCircleIcon className="h-6 w-6 text-gray-800" />
                  </button>

                  <button type="button" onClick={openFileMoverModal}>
                    <ArrowRightIcon className="h-6 w-6 text-gray-800" />
                  </button>
                </>
              )}
              <button
                type="button"
                className="p-3 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-600 focus:ring-white"
                onClick={toggleViewType}
              >
                {viewType === "list" ? <ListIcon /> : <GridIcon />}
              </button>
              {courtCase?.userRole !== "viewer" && (
                <>
                  {viewType === "list" && (
                    <button
                      type="button"
                      className="inline-flex items-center px-4 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      onClick={openFolderModal}
                    >
                      <div className="flex hidden sm:flex">
                        <FolderIcon className="h-5 w-5 -mx-px mr-2" />
                        Add Folder
                      </div>
                      <FolderAddIcon className="h-5 w-5 -mx-px  sm:hidden" />

                    </button>
                  )}
                  <button
                    type="button"
                    className={classNames(
                      $theme.button(),
                      "py-3 px-6 rounded-lg w-44 rounded-lg"
                    )}
                    onClick={handleAddFileClick}
                  >
                    Add File
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Drop Listener Here */}
          <div className="px-4 py-2 h-full">
            {viewType === "list" ? (
              <>
                <div className="flex items-center justify-between w-full h-14 rounded-t-lg shadow-md bg-white mb-3.5">
                  {TABLE_HEADERS.map((header, idx) => (
                    <div
                      className={`${idx === 0 ? "w-1/3" : "w-1/4 flex justify-center"} overflow-x-hidden whitespace-nowrap px-5 text-left font-semibold leading-7 text-black flex-auto text-sm`}
                      key={header.title}
                      onClick={() => {
                        if (header.sortOptions) {
                          handleSort(
                            header.sortOptions?.key,
                            sort.sortType === "asc" ? "desc" : "asc"
                          );
                        }
                      }}
                    >
                      <div
                        className={classNames(
                          "flex gap-2 select-none",
                          header.sortOptions && "cursor-pointer",
                          header.sortOptions?.key === sort.field &&
                          "text-indigo-700"
                        )}
                        role="button"
                      >
                        {header.title}{" "}
                        {header.sortOptions && (
                          <>
                            {sort.field === header.sortOptions.key &&
                              sort.sortType === "desc" ? (
                              <ChevronDownIcon className="w-4" />
                            ) : (
                              <ChevronUpIcon className="w-4" />
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="space-y-3.5 overflow-auto">
                  <DraggableContainer
                    onSortEnd={onSortEnd}
                  >
                    <div>
                      {children.map((file: any, index: number) => (
                        <DraggableItem
                          key={`item-${index}-${file?.id || "id"}`}
                          index={index}
                        >
                          <div className={
                            classNames(
                              "flex items-center mt-1",
                              index === children.length - 1 ? "mb-1" : ""
                            )
                          }>
                            <DraggableHandle>
                              <DotsVerticalIcon className="w-4 h-4 cursor-pointer mr-2" />
                            </DraggableHandle>
                            <div
                              key={file.id}
                              className={classNames(
                                "relative w-[calc(100%-30px)]",
                                file.type === "folder" && "dropable-object"
                              )}
                            >
                              <div
                                className={classNames(
                                  "flex items-center w-full h-20 md bg-white cursor-pointer group block w-full aspect-h-7",
                                  file.id === selectedFile?.id
                                    ? "ring-2 ring-offset-2 ring-offset-gray-100 ring-indigo-500"
                                    : null
                                )}
                              >
                                <div className="max-w-[33%] w-[33%] overflow-x-hidden whitespace-nowrap px-5 text-left font-semibold leading-7 text-black flex-auto text-sm" onClick={handleFileClick}>
                                  <div className="flex items-center">
                                    <FilePreview file={file} />
                                    <span className="ml-3">{file.name}</span>
                                  </div>
                                </div>
                                <div className="max-w-[20%] w-1/5 flex justify-center overflow-x-hidden whitespace-nowrap px-5 text-left font-normal leading-6 text-natural-8 lg:basis-96 text-sm">
                                  {$date(file.created_at).format("MMM DD, YYYY")}
                                </div>
                                <div className="max-w-[20%] w-1/5 flex justify-center overflow-x-hidden whitespace-nowrap px-5 text-left font-normal leading-6 text-natural-8 lg:basis-72 text-sm">
                                  {formatBytes(file.size)}
                                </div>

                                <div className="w-[27%] flex overflow-x-hidden whitespace-nowrap px-5 text-right font-normal leading-6 text-natural-8 lg:basis-72 text-sm">
                                  {
                                    file.type !== "folder" &&
                                    <button type="button" onClick={() => handleFileDelete(file.id)} className="absolute z-10 right-16 inset-y-0">
                                      <TrashIcon className="h-6 w-6 text-gray-800 pointer-events-none" />
                                    </button>
                                  }
                                  {
                                    !file.is_reserved &&
                                    <button type="button" onClick={handleArrowListClick(file)} className="absolute z-10 right-6 inset-y-0">
                                      <ArrowRightIcon className="h-6 w-6 text-gray-800 pointer-events-none" />
                                    </button>
                                  }
                                </div>
                                
                                <button
                                  type="button"
                                  data-file-id={file.id}
                                  className="absolute inset-0 focus:outline-none"
                                  onClick={handleFileClick}
                                >
                                  <span className="sr-only">
                                    View details for {file.name}
                                  </span>
                                </button>                                
                              </div>
                            </div>
                          </div>
                        </DraggableItem>
                      ))}
                    </div>
                  </DraggableContainer>
                </div>
              </>
            ) : (
              <ul
                role="list"
                className="grid grid-cols-2 gap-x-4 gap-y-5 sm:grid-cols-3 sm:gap-x-6 md:grid-cols-4"
              >
                {folder?.isOwner && (
                  <li className="relative">
                    <div className="group block w-full aspect-w-10 aspect-h-7 rounded-lg bg-white overflow-hidden">
                      <button
                        type="button"
                        className="absolute inset-0 flex flex-col justify-center items-center focus:outline-none text-purple-600"
                        onClick={openFolderModal}
                      >
                        <PlusIcon className="h-10 w-10" />

                        <span className="font-medium mt-4 text-sm">
                          Create New Folder
                        </span>
                      </button>
                    </div>
                  </li>
                )}

                {folder?.children.map((file: any) => (
                  <li
                    key={file.id}
                    className={classNames(
                      "relative",
                      file.type === "folder" && "dropable-object"
                    )}
                  >
                    <div
                      className={classNames(
                        "group block w-full aspect-w-10 aspect-h-7 rounded-lg bg-white overflow-hidden",
                        file.id === selectedFile?.id
                          ? "ring-2 ring-offset-2 ring-offset-gray-100 ring-indigo-500"
                          : null
                      )}
                    >
                      <FileCover file={file} />
                      <button
                        type="button"
                        data-file-id={file.id}
                        className={classNames(
                          "absolute inset-0 focus:outline-none",
                          file.type === "folder" && "dropable-object"
                        )}
                        onClick={handleFileClick}
                      >
                        <span className="sr-only">
                          View details for {file.name}
                        </span>
                      </button>
                    </div>
                    <p className="mt-2 block text-sm font-medium text-natural-13 truncate pointer-events-none">
                      {file.name}
                    </p>
                    {file.type !== "folder" && (
                      <p className="block text-sm font-medium text-gray-500 pointer-events-none">
                        {formatBytes(file.size)}
                      </p>
                    )}
                  </li>
                ))}

                {isIndex &&
                  shareFiles.map((file: any) => (
                    <li key={`share-file-${file.id}`} className="relative">
                      <div
                        className={classNames(
                          "group block w-full aspect-w-10 aspect-h-7 rounded-lg bg-white overflow-hidden",
                          file.id === selectedFile?.id
                            ? "ring-2 ring-offset-2 ring-offset-gray-100 ring-indigo-500"
                            : null
                        )}
                      >
                        <FileCover file={file} isShared />

                        <button
                          type="button"
                          data-file-id={file.id}
                          className="absolute inset-0 focus:outline-none"
                          onClick={handleFileClick}
                        >
                          <span className="sr-only">
                            View details for {file.name}
                          </span>
                        </button>
                      </div>

                      <p className="mt-2 block text-sm font-medium text-gray-900 truncate pointer-events-none">
                        {file.name}
                      </p>

                      {file.type !== "folder" && (
                        <p className="block text-sm font-medium text-gray-500 pointer-events-none">
                          {formatBytes(file.size)}
                        </p>
                      )}
                    </li>
                  ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      <FileSlider
        open={sliderOpen}
        onClose={setSliderOpen}
        onDelete={handleFileDelete}
        allowDelete={
          selectedFile && !selectedFile.is_reserved && selectedFile.isOwner
        }
        onUpdate={getFile}
        defaultTab={!!router.query.comment ? "Comments" : "Details"}
      />

      <NewFolderModal
        parentFile={folder?.id}
        isOpen={folderModalOpen}
        onClose={setFolderModalOpen}
        onFolderCreated={getFileWithoutBreadcrumb}
      />

      <FileMoverModal
        file={selectedFile}
        isOpen={fileMoverOpen}
        onClose={setFileMoverOpen}
        onMoved={handleFileMove}
      />
    </>
  );
};

FileExplorer.defaultProps = {
  isIndex: false,
};
