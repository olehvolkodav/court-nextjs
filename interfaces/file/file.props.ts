export interface UploadFileProps {
  id?: string;
  name?: string;
  hoverTitle?: string;
  types?: Array<string>;
  classes?: string;
  children?: JSX.Element;
  maxSize?: number;
  minSize?: number;
  fileOrFiles?: Array<File> | File | null;
  disabled?: boolean | false;
  label?: string | undefined;
  multiple?: boolean | false;
  onSizeError?: (arg0: string) => void;
  onTypeError?: (arg0: string) => void;
  onDrop?: (files: FileList | File) => void;
  onSelect?: (files: FileList | File) => void;
  handleChange?: (files: FileList | File) => void;
  onDraggingStateChange?: (dragging: boolean) => void;
  onUploaded?: (file: any) => void;
  onFileDeleted?: (file: any) => void
}