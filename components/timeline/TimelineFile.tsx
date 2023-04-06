import { $fileActions } from "@/store/file.store"
import { getFileSizeMB } from "@/utils/file";
import { DocumentIcon } from "@heroicons/react/outline";

export const TimelineFile: React.FC<{ file?: any }> = ({ file }) => {
  const setFile = () => {
    $fileActions.setSlideFile(file);
  }

  return (
    <li
      onClick={setFile}
      className="pl-3 pr-4 py-3 rounded-md my-2 flex items-center justify-between text-sm cursor-pointer bg-[#F5F5F7]"
    >
      <div className="w-0 flex-1 flex items-center">
        <div className="h-6 w-6">
          <DocumentIcon />
        </div>
        <span className="ml-2 flex-1 w-0 truncate">
          {file?.name}
          <br />
          {getFileSizeMB(file?.size)} MB
        </span>
      </div>
    </li>
  )
}
