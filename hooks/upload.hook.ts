import { useState } from "react";
import { $http } from "@/plugins/http";

export const useUpload = () => {
  const [files, setFiles] = useState<any[]>([]);

  const uploadFile = async(file: File, parentID?: any) => {
    if (!file) {
      return false;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", "file");

      if (parentID) {
        formData.append("file_id", parentID);
      }

      await $http.post("/files", formData);

      return true;
    } catch (error) {
      return false;
    }
  }

  const initFile = () => {
    setFiles([]);
  }

  const appendFile = (file: any) => {
    setFiles(prev => [...prev, file]);
  }

  const removeFile = (file: any) => {
    setFiles(prev => prev.filter(prevFile => prevFile.id != file.id));
  }

  return {
    files,
    initFile,
    appendFile,
    removeFile,
    uploadFile
  }
}
