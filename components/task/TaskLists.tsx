import React from "react";
import { TaskList } from "@/components/task/TaskList";
import { classNames } from "@/utils/classname";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/outline";

interface Props {
  tasks?: any[];
  updateTaskStatus?: (value: any) => void;
  openSnoozeModal?: (value: any) => void;
  setSort: (value: any) => void;
  sort: any;
}

const TABLE_HEADERS = [
  { title: "" },
  { title: "Name" },
  { title: "Due Date", column: "DUE_DATE" },
  { title: "Category", column: "CATEGORY" },
  { title: "Priority", column: "PRIORITY" },
  { title: "Tags" },
  { title: "" },
];

export const TaskLists: React.FC<Props> = ({
  tasks = [],
  updateTaskStatus,
  openSnoozeModal,
  sort,
  setSort,
}) => {
  const handleSort = (column: string, order: string) => {
    setSort({ column, order });
  };

  return (
    <div className="rounded-lg overflow-scroll">
      <div className="overflow-x-auto">
        <table className="x-2-table">
          <thead>
            <tr>
              {TABLE_HEADERS.map((header, index) => (
                <th
                  key={index}
                  onClick={() => {
                    if (header.column) {
                      handleSort(
                        header.column,
                        sort.order === "ASC" ? "DESC" : "ASC"
                      );
                    }
                  }}
                >
                  <div
                    className={classNames(
                      "flex gap-2 select-none",
                      header.column && "cursor-pointer",
                      header.column === sort.column && "text-indigo-700"
                    )}
                    role="button"
                  >
                    {header.title}{" "}
                    {header.column && (
                      <>
                        {sort.column === header.column &&
                          sort.order === "DESC" ? (
                          <ChevronDownIcon className="w-4" />
                        ) : (
                          <ChevronUpIcon className="w-4" />
                        )}
                      </>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {tasks.map((task) => (
              <TaskList
                key={task.id}
                task={task}
                onMark={updateTaskStatus}
                onSnooze={openSnoozeModal}
              />
            ))}

            {!tasks.length && (
              <tr>
                <td colSpan={7}>
                  <p className="text-center">No Todo</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
