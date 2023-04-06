import { PencilIcon } from "@heroicons/react/outline";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import {
  COURT_ORDERS,
  MY_PLEADINGS,
  OPPOSITION_PLEADINGS,
} from "../../court-document/constants";
import { FileSlider } from "../../file/FileSlider";
import { Badge } from "../../ui/Badge";
import { $fileActions } from "@/store/file.store";
import { NextLink } from "../../ui/link";
import { $date } from "@/plugins/date";

export default function CourtDocumentPreview({ source, scheduleObj }) {
  const [sliderOpen, setSliderOpen] = React.useState(false);

  const router = useRouter();
  const color = {
    [MY_PLEADINGS]: "blue",
    [OPPOSITION_PLEADINGS]: "green",
    [COURT_ORDERS]: "red",
  };

  const handleFileClick = (file: any) => () => {
    $fileActions.setSlideFile(file);
    setSliderOpen(true);
    handleClosePopup();
  };

  const handleClosePopup = () => {
    scheduleObj.closeEditor();
  };
  
  return (
    <div>
      <div className="rounded-lg overflow-hidden relative hidden sm:flex">
        <div className="absolute right-6 top-3">
          <NextLink
            href={`/dashboard/${router?.query?.case}/court-documents/${source?.fileable?.id}/edit`}
          >
            <a>
              <PencilIcon className="h-5 w-5" />
            </a>
          </NextLink>
        </div>
        <div className="flex flex-col py-10 px-3">
          <div className="flex space-x-6 items-center mb-4">
            <div
              className={"text-sm font-medium text-gray-700 min-w-[90px]"}
              role="button"
            >
              Category
            </div>
            <div className="capitalize">
              <Link
                href={`/dashboard/${router.query.case}/files/${source.parent?.id}`}
              >
                <a>
                  <Badge
                    className="list-inside list-item w-max"
                    color={color[source?.meta?.category]}
                  >
                    {source?.meta?.category?.replace("_", " ")}
                  </Badge>
                </a>
              </Link>
            </div>
          </div>
          <div className="flex space-x-6 items-center mb-4">
            <div
              className={"text-sm font-medium text-gray-700 min-w-[90px]"}
              role="button"
            >
              Title
            </div>
            <div>
              <Link
                href={`/dashboard/${router.query.case}/court-documents/${source?.fileable?.id}/edit`}
              >
                <a className="text-lg font-medium">{source?.fileable?.title}</a>
              </Link>
            </div>
          </div>
          <div className="flex space-x-6 items-center mb-4">
            <div
              className={"text-sm font-medium text-gray-700 min-w-[90px]"}
              role="button"
            >
              File Name
            </div>
            <div>
              <button
                type="button"
                className="text-lg leading-[20px] text-left font-medium"
              >
                {source?.name}
              </button>
            </div>
          </div>
          <div className="flex space-x-6 items-center mb-4">
            <div
              className={"text-sm font-medium text-gray-700 min-w-[90px]"}
              role="button"
            >
              Tags
            </div>
            <div className="flex space-x-1">
              {source?.fileable?.tags?.map((tag: any) => (
                <Badge key={`tag-${tag?.id}`} className="capitalize">
                  {tag?.name.replace("-", " ")}
                </Badge>
              ))}
            </div>
          </div>
          <div className="flex space-x-6 items-center mb-4">
            <div
              className={"text-sm font-medium text-gray-700 min-w-[90px]"}
              role="button"
            >
              Date
            </div>
            <div>
              {$date(source?.fileable?.date ?? null).format("MM-DD-YYYY")}
            </div>
          </div>
          <div className="flex space-x-6 items-center mb-4">
            <div
              className={"text-sm font-medium text-gray-700 min-w-[90px]"}
              role="button"
            ></div>
            <div className="flex items-center gap-4">
              <button
                onClick={handleFileClick(source)}
                className="bg-transparent hover:bg-primary-1 text-primary-1 font-medium hover:text-white py-2 px-4 border border-primary-1 hover:border-transparent rounded"
              >
                View
              </button>
            </div>
          </div>
        </div>
      </div>
      <FileSlider
        open={sliderOpen}
        onClose={setSliderOpen}
        allowDelete={false}
      />
    </div>
  );
}
