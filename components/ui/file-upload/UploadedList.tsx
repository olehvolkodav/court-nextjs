import { useFileUpload } from "@/context/file-upload.context";
import { $http } from "@/plugins/http";
import { classNames } from "@/utils/classname";
import { getFileSizeMB } from "@/utils/file";
import { DocumentTextIcon, PencilIcon, TrashIcon, XIcon } from "@heroicons/react/outline";
import React from "react";
import { Loading } from "../loading/Loading";
import { Switch } from "../switch/Switch";

interface Props {
  file: any;
  onDelete?: (file: any) => any;
}

export const UploadedList: React.FC<Props> = ({file, onDelete}) => {
  const [loading, setLoading] = React.useState(false);
  const [state, dispatch] = useFileUpload();

  const removeFile = async() => {
    if (!file.id) {
      // for now assume that the file is not the uploaded file
      if (onDelete) {
        onDelete(file)
      }

      return;
    }

    setLoading(true);

    try {
      const res = await $http.delete(`/files/${file.id}`);

      if (onDelete) {
        onDelete(res.data);
      }
    } catch (error) {

    } finally {
      setLoading(false);
    }
  }

  const openEditModal = () => {
    dispatch({editedFile: file, editModalOpen: true})
  }

  const togglePrivate = async(e: any) => {
    try {
      await $http.patch(`/files/${file.id}`, {
        type: "toggle_private"
      });

      // update file on reducer
      dispatch({
        files: state.files.map(f => {
          if (f.id == file.id) {
            return {
              ...f,
              is_private: !f.is_private
            }
          }

          return f;
        })
      })
    } catch (error) {

    }
  }

  return (
    <div className="px-4 py-2 border rounded-md">
      <div className="flex items-center space-x-4">
        <div>
          <DocumentTextIcon className="h-6 w-6" />
        </div>

        <div className="flex flex-1 flex-col">
          <div className="pb-2">
            <span className="text-gray-700 block text-sm">{file.name}</span>
            <span className="text-xs text-gray-500">{getFileSizeMB(file.size, 2)} MB</span>
          </div>

          {file.status !== "completed" && (
            <div className={classNames(
              "w-full bg-gray-200 rounded-full h-2.5",
              file.status === "progress" ? "animate-pulse" : ""
            )}>
              <div className={classNames(
                "h-2.5 rounded-full",
                file.status === "failed" ? "bg-red-600" : "bg-blue-600"
              )} style={{width: `${file.progress}%`}}></div>
            </div>
          )}
        </div>

        <div className="space-x-2">
          {(file.status === "progress" || loading) && (
            <Loading />
          )}

          {(file.status === "completed" && !loading) && (
            <>
            <button type="button" onClick={openEditModal}>
              <PencilIcon className="h-6 w-6" />
            </button>

            <button type="button" className="text-red-500" onClick={removeFile}>
              <TrashIcon className="h-6 w-6" />
            </button>
            </>
          )}

          {file.status === "failed" && (
            <XIcon onClick={removeFile} className="h-6 w-6 text-red-600" />
          )}
        </div>
      </div>

      {file.status  === "completed" && (
        <div className="mt-2 flex flex-1 space-x-2">
          <Switch checked={file.is_private} onChange={togglePrivate} />

          <span className="text-gray-600 text-sm">Toggle File Privacy</span>
        </div>
      )}
    </div>
  )
}
