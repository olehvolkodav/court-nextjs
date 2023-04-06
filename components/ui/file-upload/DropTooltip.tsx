import { UploadIcon } from "@heroicons/react/outline";
import React from "react";
// create portal later

export const DropTooltip: React.FC = () => {
  return (
    <div className="fixed bottom-5 flex justify-center inset-x-0">
      <div className="bg-indigo-600 text-white px-4 py-2 flex flex-col items-center rounded-lg">
        <p className="text-sm">Drop Files to instantly upload</p>

        <UploadIcon className="h-5 w-5" />
      </div>
    </div>
  )
}