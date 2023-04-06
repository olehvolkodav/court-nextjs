import React from "react";
import { TaskCard } from "@/components/task/TaskCard";

interface Props {
  tasks: any[];
  updateTaskStatus?: (value: any) => void;
  openSnoozeModal?: (value: any) => void;
  onSortOnPage: (type:string,value: string) => void;
}

export const TaskGrid: React.FC<Props> = ({
  tasks,
  updateTaskStatus,
  openSnoozeModal,
  onSortOnPage
}) => {
  return (
    <ul
      role="list"
      className="grid grid-cols-1 sm:gap-x-16 gap-y-5 sm:grid-cols-2  lg:grid-cols-3 "
    >
      {tasks.map((task) => (
        <TaskCard
          task={task}
          key={task.id}
          updateTaskStatus={updateTaskStatus}
          onSnooze={openSnoozeModal}
          onSortOnPage={onSortOnPage}
        />
      ))}
    </ul>
  );
};
