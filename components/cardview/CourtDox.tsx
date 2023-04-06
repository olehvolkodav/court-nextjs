import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Badge } from "@/components/ui/Badge";
import { $fileActions } from "@/store/file.store";
import {
  COURT_ORDERS,
  MY_PLEADINGS,
  OPPOSITION_PLEADINGS,
} from "@/components/court-document/constants";
import { $date } from "@/plugins/date";
import { FileSlider } from "../file/FileSlider";

type Props = {
  filteredData: any;
};
const color = {
  [MY_PLEADINGS]: "blue",
  [OPPOSITION_PLEADINGS]: "green",
  [COURT_ORDERS]: "red",
};
const CourtDox: React.FC<Props> = (props) => {
  const [sliderOpen, setSliderOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const { filteredData } = props;

  const router = useRouter();

  const handleFileClick = (file: any) => () => {
    $fileActions.setSlideFile(file);
    setSliderOpen(true);
  };

  return (
    <>
      <div className="sm:hidden">
        {filteredData.map((courtDocument, index) => (
          <>
            <div
              key={courtDocument.id}
              className="bg-white rounded-md p-3 mb-2 "
            >
              <div className="flex items-center justify-between mb-1">
                <div>Title</div>
                <div>
                  {" "}
                  <Link
                    href={`/dashboard/${router.query.case}/court-documents/${courtDocument.fileable.id}/edit`}
                  >
                    <a className="text-lg font-medium">
                      {courtDocument.fileable.title}
                    </a>
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-between mb-1">
                <div>File Name</div>
                <div>
                  <button
                    type="button"
                    className="text-lg font-medium"
                    onClick={handleFileClick(courtDocument)}
                  >
                    {courtDocument.name}
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between mb-1">
                <div>Tags</div>
                <div className="flex space-x-1">
                  {courtDocument.fileable?.tags?.map((tag: any) => (
                    <Badge key={`tag-${tag.id}`} className="capitalize">
                      {tag.name.replace("-", " ")}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="flex justify-between items-center mb-1">
                <div>Category</div>
                <Link
                  href={`/dashboard/${router.query.case}/files/${courtDocument.parent.id}`}
                >
                  <a>
                    <Badge
                      className="list-inside list-item w-max"
                      color={color[courtDocument.meta.category]}
                    >
                      {courtDocument.meta.category?.replace("_", " ")}
                    </Badge>
                  </a>
                </Link>
              </div>
              <div className="flex items-center justify-between mb-1">
                <div>Date</div>
                <div>
                  {$date(courtDocument.fileable?.date ?? null).format(
                    "DD/MM/YYYY"
                  )}
                </div>
              </div>
            </div>
          </>
        ))}
      </div>
      <FileSlider
        open={sliderOpen}
        onClose={setSliderOpen}
        allowDelete={false}
      />
    </>
  );
};

export default CourtDox;
