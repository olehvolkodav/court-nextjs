// Component for pagination inside table that used same style

import React from "react";
import { IPaginationProps, Pagination } from "./Pagination";

export const PaginationTable: React.FC<IPaginationProps> = (props) => {
  return (
    <div className="border-t px-4 py-2">
      <Pagination {...props} />
    </div>
  )
}