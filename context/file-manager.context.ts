import { FileManagerAction, fileManagerInitialState, FileManagerState } from '@/reducers/file-manager.reducer';
import React from 'react';

type ContextType = [FileManagerState, React.Dispatch<FileManagerAction>]

export const FileManagerContext = React.createContext<ContextType>([fileManagerInitialState, () => {}]);

export const useFileManager = () => React.useContext(FileManagerContext)