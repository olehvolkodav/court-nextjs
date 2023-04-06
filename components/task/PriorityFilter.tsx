import { DialogProps } from "@/interfaces/ui/dialog.props";
import React from "react";
import { Button } from "../ui/button";
import { PRIORITY_OPTIONS, TAG_OPTIONS } from "./utilities";
import { MultiSelect } from "../ui/multi-select/MultiSelect";

interface Props extends DialogProps {
  onFilter?: (data: Record<string, any>) => any;
}

export const PriorityFilter: React.FC<Props> = ({
  open,
  onClose,
  onFilter,
}) => {
  const [priorities, setPriorities] = React.useState<{ name: string, value: string }[]>([]);
  const [tags, setTags] = React.useState<{ name: string, value: string }[]>([]);

  const filterTodo = () => {
    if (onFilter) {
      onFilter({
        priorities: [...priorities].map((item) => item.value),
        tags: [...tags].map((item) => item.value),
      });
    }
  };

  return open ? (
    <>
      <div className="fixed inset-0" onClick={() => onClose && onClose(false)} />
      <div className="absolute bg-white mt-1 shadow-xl right-0 flex flex-col py-6 w-[350px] z-20 rounded-md">
        <div className="space-y-4 px-4 sm:px-6">
          <div>
            <p className="block text-sm font-medium text-gray-700 mb-2">
              Priority
            </p>
            <div className="flex">
              <MultiSelect
                keyBy="value"
                labelBy="name"
                options={PRIORITY_OPTIONS}
                onValueChange={setPriorities}
                value={priorities}
              />
            </div>
          </div>
          <div>
            <p className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </p>
            <div className="flex">
              <MultiSelect
                keyBy="value"
                labelBy="name"
                options={TAG_OPTIONS}
                onValueChange={setTags}
                value={tags}
              />
            </div>
          </div>
          <div>
            <Button className="w-full" onClick={filterTodo}>
              Filter To Do
            </Button>
          </div>
        </div>
      </div>
    </>
  ) : null;
};
