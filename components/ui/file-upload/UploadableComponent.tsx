import useDragging from "@/hooks/dragging.hook";
import { $http } from "@/plugins/http";
import { classNames } from "@/utils/classname";
import { checkType, getFileSizeMB } from "@/utils/file";
import { Portal } from "@headlessui/react";
import React, { useRef, useState } from "react";
import { DropTooltip } from "./DropTooltip";
import { FixedUploadedList } from "./FixedUploadedList";

// Only div element for now
// may @deprecated this component

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  types?: string[];
  onFileChange?: (files: FileList | File) => void;
  onSizeError?: (message: string ) => void,
  onTypeError?: (message: string) => void,
  onUploaded?: (file: any) => void;
  maxSize?: number;
  minSize?: number;

  // parent file id
  parentFile?: any;
}

export const UploadableComponent: React.FC<Props> = ({
  children,
  types,
  onFileChange,
  onSizeError,
  onTypeError,
  maxSize,
  minSize,
  onUploaded,
  parentFile,
  ...rest
}) => {
  const labelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState(false);

  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);

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
            status: "pending",
            progress: 0,
            key: Date.now() + i + 1,
          }])
        }
      }
      if (checkError) {
        return false;
      }

      if (onFileChange) {
        onFileChange(files);
      }

      setError(false);
      return true;
    }
    return false;
  };

  const dragging = useDragging({
    labelRef,
    multiple: true,
    handleChanges,
    inputRef,
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
      formData.append("type", "file");

      if (parentFile) {
        formData.append("file_id", parentFile)
      }

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
      });

      if (onUploaded) {
        onUploaded(res.data);
      }
    } catch (error) {
      updateUploadingFile(file, {
        status: "failed",
      });
    }
  }, [uploadedFiles, onUploaded, parentFile]);

  const clearUploadedFiles = () => setUploadedFiles([]);

  React.useEffect(() => {
    const file = uploadedFiles.find(o => {
      return o.status === "pending";
    });

    if (file) {
      uploadFile(file)
    }
  }, [uploadedFiles, uploadFile]);

  return (
    <div {...rest}
      ref={labelRef}
      className={classNames(
        rest.className,
        dragging && "border-2 border-indigo-300 rounded-md"
      )}
    >
      {children}
      {dragging && (
        <Portal>
          <DropTooltip />
        </Portal>
      )}

      {!!uploadedFiles.length && (
        <Portal>
          <FixedUploadedList files={uploadedFiles} onClose={clearUploadedFiles} />
        </Portal>
      )}
    </div>
  )
}
