import { getFile, imageLoader, isImage } from "@/utils/file";
import { LockClosedIcon } from "@heroicons/react/outline";
import { FolderIcon } from "@heroicons/react/solid";
import Image from "next/image";

export const FilePreview: React.FC<{file: any}> = ({ file }) => {
  if (isImage(file.ext)) {
    return (
      <Image
        width={64}
        height={64}
        priority={undefined}
        loader={imageLoader}
        src={getFile(file.path, file.disk)}
        alt={file.name}
        className="object-cover"
        layout="fixed"
      />
    );
  }

  if (file.type === "folder") {
    return (
      <div>
        <div className="relative">
          <FolderIcon className="h-16 w-16 text-indigo-500" />

          {file.is_reserved && (
            <LockClosedIcon
              className="h-5 w-5 absolute bottom-4 right-2 text-white"
            />
          )}
        </div>
      </div>
    );
  }

  return null;
}
