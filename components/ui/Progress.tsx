import React from "react";

interface Props {
  value: string | number;
  size?: string;
  label?: string;
}

export const Progress: React.FC<Props> = ({value, size, label}) => {
  return (
    <div>
      {!!label && (
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm">
            {label}
          </span>
        </div>
      )}

      <div className="w-full bg-gray-100 rounded-md h-7 relative">
        <div className="bg-blue-600 h-7 rounded-md" style={{width: `${value}%`}}></div>

        <div className="absolute inset-0 right-0 flex justify-end items-center pr-2">
          <span className="text-sm">{value}%</span>
        </div>
      </div>
    </div>
  )
}

Progress.defaultProps = {
  size: "h-7",
}
