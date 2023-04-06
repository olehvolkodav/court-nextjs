import React, { useEffect, useRef, useState } from "react";
import { useStore } from "effector-react";
import {
  PencilIcon,
  DownloadIcon,
  TrashIcon,
  EyeIcon,
  PlusIcon,
  SaveIcon,
  XIcon,
} from "@heroicons/react/outline";
import { FileShareModal } from "./FileShareModal";
import { ShareIcon } from "@/components/icons/ShareIcon";
import { Button } from "../ui/button";
import { Input } from "../ui/form";
import { useFileSlider } from "@/context/file-slider.context";
import { useDownload } from "@/hooks/download.hook";
import { $http } from "@/plugins/http";
import { $slideFile } from "@/store/file.store";
import { useFile } from "@/swr/file.swr";
import { formatBytes, getFile } from "@/utils/file";
import { $fileActions } from "@/store/file.store";

export const FileDetail: React.FC = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const viewer = useRef(null);

  const { onDelete, allowDelete, onUpdate } = useFileSlider();
  const file = useStore($slideFile);
  const [fetchFile, , , mutate] = useFile(file?.id);

  const { windowDownload } = useDownload();

  const [loading, setLoading] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [name, setName] = useState(file?.name);

  const toggleEditing = () => setIsEditing((prev) => !prev);

  const showShareToggle = () => {
    setShareModalOpen((prev) => !prev);
  };

  const deleteFile = () => {
    setLoading(true);

    try {
      if (onDelete) {
        onDelete(file.id);
      }
    } catch (error) {}
  };

  // download file or folder
  const downloadFile = async () => {
    const res = await $http.post(
      `/files/${file.id}/download`,
      {},
      {
        responseType: "blob",
      }
    );

    windowDownload(
      res.data,
      file.type === "folder" ? `${file.name}.zip` : file.name
    );
  };

  const reloadFile = () => {
    mutate();
    setShareModalOpen(false);
  };

  const updateFile = async () => {
    setLoading(true);

    try {
      await $http.patch(`/files/${file.id}`, {
        name,
        tags: file.tags?.map((tag: any) => tag.name),
        type: "update",
        is_private: file.is_private,
      });

      setIsEditing(false);
      if (onUpdate) {
        onUpdate(file);
      }
    } catch (error) {
    } finally {
      setLoading(false);
      $fileActions.setSlideFile({ ...file, name });
    }
  };

  useEffect(() => {
    const input = inputRef.current;

    if (!!input) {
      input.focus();
    }
  }, [isEditing]);

  useEffect(() => {
    const loadWebViewer = async () => {
      const WebViewer = (await import("@pdftron/webviewer")).default;
      if (viewer.current) {
        WebViewer(
          {
            path: "/webviewer",
            config: "",
            streaming: false,
            enableAnnotations: false,
          },
          viewer.current as any
        )
          .then((instance) => {
            instance.UI.loadDocument(getFile(file.path, file.disk));
          })
          .catch((err) => console.log(err));
      }
    };
    loadWebViewer();
  }, [file]);

  return (
    <>
      <div className="flex items-center flex-wrap mr-4 space-y-4 py-10 mt-2 max-w-[62rem] w-full flex-col sm:flex-row">
        <div className="flex-1 flex flex-col mb-2 sm:mb-0">
          {!isEditing ? (
            <div className="flex justify-start">
              <span className="font-medium text-natural-12 text-3xl mr-3.5 ">
                {file.name}
              </span>
              {file.isOwner && !file.is_reserved && (
                <button type="button" onClick={toggleEditing}>
                  <PencilIcon className="h-5 w-5 text-natural-7" />
                </button>
              )}
            </div>
          ) : (
            <div className="flex">
              <Input value={name} ref={inputRef} onChangeText={setName} />
            </div>
          )}
          <div>
            <span className="text-lg text-gray-700 block mt-4 leading-none">
              {formatBytes(file.size)}
            </span>
          </div>
        </div>
        <div className="flex flex-col space-y-5 md:flex-row md:space-y-0 md:space-x-5">
          {!isEditing ? (
            <>
              <a
                href={getFile(file.path, file.disk)}
                target="_blank"
                rel="noreferrer"
              >
                <Button
                  className="py-2.5 px-5 rounded-lg gap-2.5 text-sm"
                  color="default"
                >
                  <EyeIcon className="w-4 h-4 text-natural-7" />
                  <span className="text-primary-1 font-semibold">
                    Preview file
                  </span>
                </Button>
              </a>
              <Button
                className="py-2.5 px-5 rounded-lg gap-2.5 text-sm"
                onClick={downloadFile}
              >
                <DownloadIcon className="w-4 h-4 text-white" />
                Download
              </Button>
              <Button
                className="py-2.5 px-5 rounded-lg gap-2.5 text-sm"
                onClick={deleteFile}
                color="danger"
              >
                <TrashIcon className="w-4 h-4" />
                Delete
              </Button>
            </>
          ) : (
            <div className="flex flex-col md:flex-row space-y-5 md:space-y-0 md:space-x-5">
              <Button
                color="default"
                className="py-3.5 px-7 rounded-lg gap-2.5 text-base"
                onClick={toggleEditing}
              >
                <XIcon className="w-6 h-6 text-natural-7" />
                Cancel
              </Button>
              <Button
                className="py-3.5 px-7 rounded-lg gap-2.5 text-base"
                onClick={updateFile}
              >
                <SaveIcon className="w-6 h-6 text-white" />
                Save
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="webviewer" ref={viewer} style={{ height: "100vh" }} />

      {!file.is_reserved && file.isOwner && (
        <div className="py-10">
          <div>
            <span className="font-medium text-natural-12 text-3xl font-medium">
              Shared with
            </span>
            <div className="mt-4 flex">
              {fetchFile?.shares.map((user: any, idx) => (
                <span
                  key={user.id}
                  className="text-base font-medium text-primary-1"
                >
                  {user.name}
                  {fetchFile?.shares.length - 1 !== idx && <span>,&nbsp;</span>}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row space-y-5 md:space-y-0 md:space-x-5 mt-8">
        <Button
          className="py-3.5 px-7 rounded-lg gap-2.5 text-base"
          color="default"
          onClick={showShareToggle}
        >
          <ShareIcon aria-hidden="true" />
          <span className="text-primary-1 font-semibold">Share</span>
        </Button>
        <Button className="py-3.5 px-7 rounded-lg gap-2.5 text-base">
          <PlusIcon className="w-6 h-6 text-white" />
          Add To Evidence
        </Button>
      </div>

      <FileShareModal
        file={file}
        isOpen={shareModalOpen}
        onClose={setShareModalOpen}
        onAdded={reloadFile}
      />
    </>
  );
};
