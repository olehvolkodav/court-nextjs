import { getFile, imageLoader, isAudio, isImage } from "@/utils/file";
import { DocumentTextIcon, MusicNoteIcon } from "@heroicons/react/outline";
import Image from "next/image";
import React from "react";

export const CardAttachmentPreview: React.FC<{file: any}> = ({file}) => {
  const getPreview = React.useMemo(() => {
    if (isImage(file.ext)) {
      return (
        <Image
          priority={undefined}
          loader={imageLoader}
          src={getFile(file.path, file.disk)}
          alt={file.name}
          className="object-cover pointer-events-none"
          layout="fill"
        />
      )
    }

    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center border rounded-md bg-gray-50">
        {isAudio(file.ext) ? (
          <MusicNoteIcon className="h-6 w-6" />
        ) : <DocumentTextIcon className="h-6 w-6" />}
        <span className="block">{file.ext}</span>
      </div>
    )
  }, [file]);

  return (
    <div className="w-[110px] h-[80px] relative">
      {getPreview}
    </div>
  )
}
