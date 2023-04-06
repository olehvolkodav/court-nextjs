import { $date } from "@/plugins/date";
import React from "react";

export const DefaultPreview = ({ source }) => {
  return (
    <div className="rounded-lg overflow-hidden relative hidden sm:flex">
      <div className="flex flex-col py-10 px-3">
        {source.title && (
          <div
            className={
              "text-xl leading-6 mb-3 font-medium text-gray-900 cursor-pointer min-w-[90px]"
            }
            role="button"
          >
            {source.title}
          </div>
        )}
        {source?.date && (
          <div className="flex space-x-6 items-center mb-4">
            <div
              className={"text-sm font-medium text-gray-700 min-w-[90px]"}
              role="button"
            >
              Date
            </div>
            <div>{$date(source?.date).format("MM-DD-YYYY")}</div>
          </div>
        )}
        {source?.description && source?.isRichText && (
          <div className="flex space-x-6 items-center mb-4">
            <div
              className={"text-sm font-medium text-gray-700 min-w-[90px]"}
              role="button"
            >
              Description
            </div>
            <div
              className="text-md font-normal"
              dangerouslySetInnerHTML={{ __html: source?.description }}
            ></div>
          </div>
        )}
        {source?.description && (
          <div className="flex space-x-6 items-center mb-4">
            <div
              className={"text-sm font-medium text-gray-700 min-w-[90px]"}
              role="button"
            >
              Description
            </div>
            <div className="text-md font-normal">{source?.description}</div>
          </div>
        )}
      </div>
    </div>
  );
};
