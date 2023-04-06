import { formatBytes } from "@/utils/file";
import { DocumentTextIcon } from "@heroicons/react/outline";
import React, { SVGProps } from "react";

interface Props {
  icon?: (props: SVGProps<SVGSVGElement>) => JSX.Element
  count: number;
  size: number;
  label?: string;
}

export const FileStat: React.FC<Props> = ({icon: Icon, count, size, label}) => {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center">
        {!!Icon && (
          <span className="bg-[#F7F2FD] h-10 w-10 rounded-full flex items-center justify-center mr-4">
            <Icon className="h-6 w-6 text-[#6200EE]" />
          </span>
        )}

        <div>
          <dt className="font-semibold text-sm">{label}</dt>
          <span className="text-xs text-gray-500">{count} files</span>
        </div>
      </div>

      <span className="font-semibold text-lg">
        {formatBytes(size)}
      </span>
    </div>
  )
}

FileStat.defaultProps = {
  icon: DocumentTextIcon,
  label: "Files"
}