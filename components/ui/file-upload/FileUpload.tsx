import React, { useState, useRef, useEffect } from "react";
import { useReducer } from "react";

import { FileEdit } from "./FileEdit";
import { UploadedList } from "./UploadedList";

import { FileUploadProvider } from "@/context/file-upload.context";
import useDragging from "@/hooks/dragging.hook";
import { $http } from "@/plugins/http";
import { fileUploadInitialState, fileUploadReducer } from "@/reducers/file-upload.reducer";
import { classNames } from "@/utils/classname";
import { checkType, getFileSizeMB } from "@/utils/file";

interface Props {
  id?: string;
  name?: string;
  types?: Array<string>;
  children?: JSX.Element;
  maxSize?: number;
  minSize?: number;
  files?: Array<File>;
  disabled?: boolean | false;
  label?: string | undefined;
  multiple?: boolean | false;
  extraDescription?: string;
  onSizeError?: (arg0: string) => void;
  onTypeError?: (arg0: string) => void;
  onDrop?: (arg0: FileList | File) => void;
  handleChange?: (arg0: FileList | File) => void;
  onDraggingStateChange?: (dragging: boolean) => void;
  onUploaded?: (file: any) => void;
  onFileDeleted?: (file: any) => void
}

export const FileUpload: React.FC<Props> = (props) => {
  const {
    id,
    types,
    handleChange,
    maxSize,
    minSize,
    onSizeError,
    onTypeError,
    onDrop,
    multiple,
    onUploaded,
    onFileDeleted,
    files,
    extraDescription
  } = props;

  const labelRef = useRef<HTMLLabelElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState(false);

  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);

  const [state, dispatch] = useReducer(fileUploadReducer, fileUploadInitialState);

  const validateFile = (file: File) => {
    if (types && !checkType(file, types)) {
      // types included and type not in them
      setError(true);
      if (onTypeError) onTypeError("File type is not supported");
      return false;
    }

    if (maxSize && getFileSizeMB(file.size) > maxSize) {
      setError(true);
      if (onSizeError) onSizeError("File size is too big");
      return false;
    }

    if (minSize && getFileSizeMB(file.size) < minSize) {
      setError(true);
      if (onSizeError) onSizeError("File size is too small");
      return false;
    }

    return true;
  };

  const handleChanges = (files: FileList | File): boolean => {
    let checkError = false;

    if (files) {
      if (files instanceof File) {
        checkError = !validateFile(files);
      } else {
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          checkError = !validateFile(file) || checkError;

          setUploadedFiles(prev => [...prev, {
            file: files.item(i),
            name: file.name,
            size: file.size,
            status: "pending",
            progress: 0,
            key: Date.now() + i + 1,
          }])
        }
      }
      if (checkError) {
        return false;
      }

      if (handleChange) {
        handleChange(files);
      }

      setError(false);
      return true;
    }

    return false;
  };

  const dragging = useDragging({
    labelRef,
    inputRef,
    multiple,
    handleChanges,
    onDrop
  });

  const updateUploadingFile = (file: any, props: Record<string, any>) => {
    setUploadedFiles(prev => {
      return prev.map(prevFile => {
        if (prevFile.key == file.key) {
          return {
            ...prevFile,
            ...props,
          }
        }

        return prevFile
      })
    })
  }

  const uploadFile = React.useCallback(async(file: any) => {
    if (uploadedFiles.find(o => o.status === "progress")) {
      return;
    }

    try {
      updateUploadingFile(file, {
        status: "progress"
      });

      const formData = new FormData();

      formData.append("file", file.file);
      formData.append("type", "file")

      const res = await $http.post("/files", formData, {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);

          updateUploadingFile(file, {
            progress: percentCompleted,
          });
        }
      });

      updateUploadingFile(file, {
        status: "completed",
        id: res.data.id || null,
        ext: res.data.ext
      });

      if (onUploaded) {
        onUploaded(res.data);
      }
    } catch (error) {
      updateUploadingFile(file, {
        status: "failed",
      });
    }
  }, [uploadedFiles, onUploaded]);

  const locallyDeleteFile = (file: any) => {
    if (onFileDeleted) {
      onFileDeleted(file);
    }

    setUploadedFiles(prev => prev.filter(prevFile => {
      if (prevFile.id && file.id) {
        return prevFile.id != file.id
      }

      return prevFile.key != file.key;
    }))
  }

  const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    if (e.target.files?.length) {
      handleChanges(e.target.files)
    }
  }

  useEffect(() => {
    const file = uploadedFiles.find(o => {
      return o.status === "pending";
    });

    if (file) {
      uploadFile(file)
    }
  }, [uploadedFiles, uploadFile]);

  useEffect(() => {
    dispatch({files: uploadedFiles})
  }, [uploadedFiles])

  useEffect(() => {
    dispatch({files});
  }, [files]);

  return (
    <FileUploadProvider value={[state, dispatch]}>
      <div className="bg-[#F8F8FD]">
        <label
          ref={labelRef as any}
          htmlFor={id}
          className={
            classNames(
              "flex justify-center border-purple-500 border-2 border-dashed rounded-md cursor-pointer hover:border-indigo-300",
              dragging ? "border-indigo-300" : "border-gray-300"
            )
          }
        >
          <div className="flex flex-col items-center space-y-1 text-center px-6 py-11">
            <svg
              className="h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="flex text-sm text-natural-7">
              <div
                className="relative rounded-md font-medium text-purple-500 hover:text-purple-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-purple-500"
              >
                <span>Click to upload</span>
                <input onChange={handleInputChange} multiple={multiple} id={id} name={id} type="file" ref={inputRef} className="sr-only" />
              </div>
              <p className="pl-1">or drag and drop</p>
            </div>
            {
              !!extraDescription &&
              <p className="text-sm text-natural-7 mt-2">{extraDescription}</p>
            }
          </div>
        </label>

        <div className="mt-4 space-y-2">
          {state.files.map((file) => (
            <UploadedList key={file.id || file.key} file={file} onDelete={locallyDeleteFile} />
          ))}
        </div>

        <FileEdit isOpen={state.editModalOpen} />
      </div>
    </FileUploadProvider>
  )
}

FileUpload.defaultProps = {
  id: "file-upload",
  multiple: true,
  files: []
}
