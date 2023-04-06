import React from "react";

interface Props {
  onFilter?: (key: string, data: Record<string, any>) => any;
  children?: any;
}

export const TimelineFilter: React.FC<Props> = ({ children }) => {
  return (
    <div className="mx-auto max-w-6xl flex bg-white py-6 items-center space-x-3">
      { children }
    </div>
  )
}
