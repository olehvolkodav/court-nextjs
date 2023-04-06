import { $date } from "@/plugins/date";
import { $http } from "@/plugins/http";
import { classNames } from "@/utils/classname";
import { CheckIcon } from "@heroicons/react/solid";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { Badge } from "../ui/Badge";
import { Loading } from "../ui/loading/Loading";
import TodoMenu from "@/components/task/TodoMenu";
import { getPriorityColor } from "@/components/task/utilities";

interface ITaskListProps {
  task: any;
  onMark?: (task: any) => void;
  onSnooze?: (task: any) => any;
}

export const TaskList: React.FC<ITaskListProps> = ({
  task,
  onMark,
  onSnooze,
}) => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const toggleTaskStatus = async () => {
    setLoading(true);

    try {
      const { data } = await $http.post(`/tasks/${task.id}/checked`, {
        status: task.status === "closed" ? "open" : "closed",
      });

      if (onMark) {
        onMark(data.task);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const priorityColor = getPriorityColor(task.priority_name);

  return (
    <tr className="rounded-lg">
      <td width={5}>
        <button
          type="button"
          className={classNames(
            "h-8 w-8 border rounded-full inline-flex items-center justify-center",
            task.status === "closed"
              ? "bg-primary-1 border-primary-1"
              : "border-natural-7"
          )}
          onClick={toggleTaskStatus}
        >
          {task.status === "closed" && (
            <CheckIcon className="h-5 w-5 text-white" />
          )}
          {loading && <Loading />}
        </button>
      </td>
      <td>
        <Link
          href={{
            pathname: "/dashboard/[case]/tasks/[id]/edit",
            query: { id: task.id, case: router.query.case },
          }}
        >
          <a className="text-lg font-medium text-natural-13">{task.name}</a>
        </Link>
      </td>
      <td>
        <Badge>{$date(task.due_date).format("DD MMMM YYYY")}</Badge>
      </td>
      <td className="capitalize text-natural-13 font-medium">
        {task.category}
      </td>

      <td>
        <span
          className={classNames(
            "rounded-lg px-4 py-1.5 inline-flex text-white text-sm font-medium capitalize",
            priorityColor
          )}
        >
          {task.priority_name}
        </span>
      </td>

      <td>
        {!!task.tags?.length && (
          <div className="flex space-x-2">
            {task.tags.map((tag: any) => (
              <span
                className="px-6 py-1.5 border border-natural-10 rounded-full text-sm uppercase"
                key={tag.id}
              >
                {tag.name}
              </span>
            ))}
          </div>
        )}
      </td>

      <td>
        <div className="flex space-x-4">
          <TodoMenu task={task} onSnooze={onSnooze} />
        </div>
      </td>
    </tr>
  );
};
