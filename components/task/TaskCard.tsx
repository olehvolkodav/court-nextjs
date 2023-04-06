import React, { useState } from "react";
import TodoMenu from "@/components/task/TodoMenu";
import { $date } from "@/plugins/date";
import { Badge } from "@/components/ui/Badge";
import { classNames } from "@/utils/classname";
import { CheckIcon } from "@heroicons/react/solid";
import { Loading } from "@/components/ui/loading";
import { $http } from "@/plugins/http";
import { getPriorityColor } from "@/components/task/utilities";

interface Props {
  task: any;
  updateTaskStatus?: (value: any) => void;
  onSnooze?: (task: any) => any;
  onSortOnPage: (type: string, value: string) => void;
}

export const TaskCard: React.FC<Props> = ({
  task,
  updateTaskStatus,
  onSnooze,
  onSortOnPage,
}) => {
  const [loading, setLoading] = useState(false);

  const priorityColor = getPriorityColor(task.priority_name);

  const toggleTaskStatus = async () => {
    setLoading(true);

    try {
      const { data } = await $http.post(`/tasks/${task.id}/checked`, {
        status: task.status === "closed" ? "open" : "closed",
      });

      if (updateTaskStatus) {
        updateTaskStatus(data.task);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="group block w-full rounded-lg bg-white p-5">
      <div className="flex justify-between">
        <div className="flex items-center space-x-2">
          <div className="mt-1">
            <button
              type="button"
              className={classNames(
                "h-8 w-8 border rounded-full inline-flex items-center justify-center mr-2",
                task.status === "closed"
                  ? "bg-primary-1 border-primary-1"
                  : "border-natural-7"
              )}
              onClick={toggleTaskStatus}
            >
              {task.status === "closed" && !loading && (
                <CheckIcon className="h-5 w-5 text-white" />
              )}
              {loading && <Loading />}
            </button>
          </div>
          <h5 className="text-2xl font-medium">
            {task.name ? task.name : task.title}
          </h5>
        </div>
        <TodoMenu task={task} onSnooze={onSnooze} />
      </div>

      <div className="mt-5">
        <dl className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div>
            <dt>Due Date:</dt>
          </div>

          <div className="sm:col-span-2">
            <Badge>{$date(task.due_date).format("DD MMMM YYYY")}</Badge>
          </div>

          <div>
            <dt>Category:</dt>
          </div>

          <div className="sm:col-span-2">
            <dt className="capitalize font-medium">{task.category}</dt>
          </div>

          <div className="flex items-center">
            <dt>Priority:</dt>
          </div>

          <div
            onClick={() => onSortOnPage("priority", task.priority)}
            className="sm:col-span-2 cursor-pointer"
          >
            <dt>
              <span
                className={classNames(
                  "rounded-lg px-4 py-1.5 inline-flex text-white text-sm font-medium capitalize",
                  priorityColor
                )}
              >
                {task.priority_name}
              </span>
            </dt>
          </div>

          {!!task.tags?.length && (
            <div className="col-span-3">
              <div className="flex gap-2 flex-wrap">
                {task.tags.map((tag: any) => (
                  <span
                    onClick={() => onSortOnPage("tag", tag.id)}
                    className="px-6 py-1.5 border border-natural-10 rounded-full text-sm uppercase cursor-pointer"
                    key={tag.id}
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="col-span-2 sm:col-span-3 ">
            <dt>
              <div
                dangerouslySetInnerHTML={{
                  __html: task.description,
                }}
              />
            </dt>
          </div>
        </dl>
      </div>

      <p className="mt-2 block text-sm font-medium text-gray-900 truncate pointer-events-none"></p>
    </div>
  );
};
