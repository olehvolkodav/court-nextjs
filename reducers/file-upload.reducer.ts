import React from "react"

export const fileUploadInitialState = {
  editedFile: null as any,
  files: [] as any[],
  editModalOpen: false,
}

export type FileUploadState = ReturnType<() => typeof fileUploadInitialState>

export const fileUploadReducer: React.Reducer<FileUploadState, any> = (state, action) => {
  return {
    ...state,
    ...action
  }
}