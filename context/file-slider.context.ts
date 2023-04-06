import React from 'react';

interface IFileSliderContext {
  allowDelete?: boolean;
  onDelete?: (fileID: any) => any
  onUpdate?: (file: any) => any
}

export const FileSliderContext = React.createContext<IFileSliderContext>({
  allowDelete: false,
});

export const FileSliderProvider = FileSliderContext.Provider;
export const useFileSlider = () => React.useContext(FileSliderContext);
