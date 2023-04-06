import { TaskSnoozeModal } from "@/components/task/TaskSnoozeModal";
import { useAllTasksQuery } from "@/graphql/execution/tasks";
import React, { useState } from "react";
import { TaskCard } from "../../task/TaskCard";

export const ToDoPreview = ({ source, scheduleObj }) => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [snoozeModalOpen, setSnoozeModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>();

  const { all_tasks, refetch } = useAllTasksQuery();

  const updateTaskStatus = (task: any) => {
    setTasks((prev) => {
      return prev.filter((t) => t.id != task.id);
    });
    refetch();
  };

  const openSnoozeModal = (task: any) => {
    setSnoozeModalOpen(true);
    setSelectedTask(task);
    scheduleObj.closeEditor();
  };

  const closeSnoozeModal = () => {
    setSnoozeModalOpen(false);
  };

  const handleSnooze = () => {
    setSnoozeModalOpen(false);
  };

  const compare = (source: Task[], type: string, value: string) => {
    let copied: any = [];
    if (type === "priority") {
      source.forEach((task) => {
        if (parseInt(task.priority) === parseInt(value)) {
          copied.unshift(task);
        } else {
          copied.push(task);
        }
      });
    } else {
      source.forEach((task) => {
        let tag = task.tags.find(
          (_tag: { id: string; name: string }) => _tag.id === value
        );
        if (tag) {
          copied.unshift(task);
        } else {
          copied.push(task);
        }
      });
    }
    return copied;
  };

  const onSortOnPage = (type: string, value: string) => {
    let copiedTasks = [...tasks];
    setTasks(compare(copiedTasks, type, value));
  };

  return (
    <>
      <div className="py-4">
        <TaskCard
          task={source}
          key={source.id}
          updateTaskStatus={updateTaskStatus}
          onSnooze={openSnoozeModal}
          onSortOnPage={onSortOnPage}
        />
      </div>
      <TaskSnoozeModal
        isOpen={snoozeModalOpen}
        onClose={closeSnoozeModal}
        task={selectedTask}
        onSnooze={handleSnooze}
      />
    </>
  );
};

interface Task {
  id: string;
  user_id: string;
  name: string;
  category: string;
  description: string;
  priority: string;
  priority_name: "string";
  status: string;
  due_date: string;
  tags: [
    {
      id: string;
      name: string;
    }
  ];
}
