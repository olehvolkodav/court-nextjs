import { FilterSlide } from "../FilterSlide";
import { DialogProps } from "@/interfaces/ui/dialog.props";
import React from "react";
import { Button } from "../ui/button";
import { MultiSelect } from "@/components/ui/multi-select/MultiSelect";
import { FILTER_OPTIONS } from "@/components/court-document/constants";

interface Props extends DialogProps {
  onFilter?: (data: Record<string, any>) => any;
}

export const CourtDocumentFilter: React.FC<Props> = ({
  open,
  onClose,
  onFilter,
}) => {
  const [categories, setCategories] = React.useState<string[]>([]);

  const filterEvidence = () => {
    if (onFilter) {
      onFilter({
        categories,
      });
    }
  };

  return open ? (
    <>
      <div className="fixed inset-0" onClick={() => onClose && onClose(false)} />
      <div className="absolute bg-white mt-1 shadow-xl right-0 flex flex-col py-6 w-[350px] z-20 rounded-md">
        <div className="space-y-6 px-4 sm:px-6">
          <div>
            <p className="block text-sm font-medium text-gray-700 mb-2">
              Category Type
            </p>
            <div className="flex">
              <MultiSelect
                keyBy="value"
                labelBy="name"
                options={FILTER_OPTIONS}
                onValueChange={setCategories}
                value={categories}
              />
            </div>
          </div>
          <div>
            <Button className="w-full" onClick={filterEvidence}>
              Filter Court Document
            </Button>
          </div>
        </div>
      </div>
    </>
  ) : null;
};
