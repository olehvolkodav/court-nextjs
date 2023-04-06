import React from "react";

export const fileManagerInitialState = {
  isOpen: false,
  files: [] as any[]
}

export type FileManagerState = ReturnType<() => typeof fileManagerInitialState>;

export interface FileManagerAction {
  type: 'modal';
  value: any;
}

export const fileManagerReducer: React.Reducer<FileManagerState, FileManagerAction> = (state, action) => {
  if (action.type === 'modal') {
    return {
      ...state,
      isOpen: action.value
    }
  }

  return state;
}