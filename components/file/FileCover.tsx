import { getFile, imageLoader, isImage } from "@/utils/file";
import { DocumentTextIcon, LockClosedIcon, UserIcon } from "@heroicons/react/outline";
import { FolderIcon } from "@heroicons/react/solid";
import Image from "next/image";

interface Props {
  isShared?: boolean;
  file: any;
}

// Feel free to ask if this file name need to change
export const FileCover: React.FC<Props> = ({file, isShared}) => {
  if (isImage(file.ext)) {
    return (
      <Image
        // width={250}
        priority={undefined}
        loader={imageLoader}
        src={getFile(file.path, file.disk)}
        alt={file.name}
        className="object-cover pointer-events-none"
        layout="fill"
      />
    )
  }

  if (file.type === "folder") {
    return (
      <div>
        <div className="absolute inset-0 flex items-center justify-center">
          <FolderIcon className="h-20 w-20 text-indigo-500" />
        </div>

        {file.is_reserved && (
          <div className="absolute top-0 right-0 inset-0 flex justify-end pr-4 pt-2">
            <LockClosedIcon className="h-6 w-6 absolute" />
          </div>
        )}

        {isShared && (
          <div className="absolute top-0 right-0 inset-0 flex justify-end pr-4 pt-2">
            <UserIcon className="h-6 w-6 absolute" />
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <DocumentTextIcon className="h-8 w-8" />
    </div>
  )
}

FileCover.defaultProps = {
  isShared: false,
}
