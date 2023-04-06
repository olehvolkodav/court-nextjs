import { fileUploadInitialState, FileUploadState } from "@/reducers/file-upload.reducer";
import React from "react";

type FileUploadContextType = [FileUploadState, React.Dispatch<Partial<FileUploadState>>]

export const FileUploadContext = React.createContext<FileUploadContextType>([fileUploadInitialState, () => {}])

export const FileUploadProvider = FileUploadContext.Provider;

export const useFileUpload = () => React.useContext(FileUploadContext);