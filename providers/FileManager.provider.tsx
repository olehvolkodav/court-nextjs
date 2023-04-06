import { FileManager } from "@/components/file/file-manager/FileManager";
import { FileManagerContext } from "@/context/file-manager.context";
import { fileManagerInitialState, fileManagerReducer } from "@/reducers/file-manager.reducer";
import React, { useReducer } from "react";

interface Props {
  children: React.ReactNode;
}

export const FileManagerProvider: React.FC<Props> = ({children}) => {
  const [state, dispatch] = useReducer(fileManagerReducer, fileManagerInitialState);

  return (
    <FileManagerContext.Provider value={[state, dispatch]}>
      {children}
      <FileManager isOpen={state.isOpen} />
    </FileManagerContext.Provider>
  )
}