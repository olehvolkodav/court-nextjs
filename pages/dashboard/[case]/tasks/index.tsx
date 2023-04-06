import { TaskFilter } from "@/components/task/TaskFilter";
import { TaskSnoozeModal } from "@/components/task/TaskSnoozeModal";
import { Pagination } from "@/components/ui/pagination";
import {
  PAGINATION_FIELD,
  PAGINATION_PARAMS,
  PAGINATION_VARS,
  parsePage,
} from "@/graphql/query/util";
import { withDashboardLayout } from "@/hoc/layout";
import { NextPageWithLayout } from "@/interfaces/page.type";
import { $gql } from "@/plugins/http";
import {
  paginationInitialState,
  paginationReducer,
} from "@/reducers/pagination.reducer";
import { $theme } from "@/theme";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useReducer, useState } from "react";
import ListIcon from "@/components/icons/ListIcon";
import GridIcon from "@/components/icons/GridIcon";
import { PriorityFilter } from "@/components/task/PriorityFilter";
import { FilterIcon, SortAscendingIcon, SortDescendingIcon } from "@heroicons/react/outline";
import { TaskGrid } from "@/components/task/TaskGrid";
import { TaskLists } from "@/components/task/TaskLists";
import { classNames } from "@/utils/classname";

const TASKS_QUERY = `
  query(${PAGINATION_PARAMS},$priorities:[String!],$tags:[String!], $status: String, $orderBy: [QueryMyTasksOrderByOrderByClause!]) {
    tasks: my_tasks(
      ${PAGINATION_VARS}
      status: $status
      priorities: $priorities
      tags: $tags
      orderBy: $orderBy
    ) {
      ${PAGINATION_FIELD}
      data {
        id
        user_id
        name
        category
        description
        priority
        priority_name
        status
        due_date
        tags {
          id
          name
        }
      }
    }
  }
`;

const TasksPage: NextPageWithLayout = () => {
  const router = useRouter();
  const [priorities, setPriorities] = useState<Record<string, any>>([]);
  const [tags, setTags] = useState<Record<string, any>>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [snoozeModalOpen, setSnoozeModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>();
  const [status, setStatus] = useState("open");
  const [viewType, setViewType] = useState<string>("grid");
  const [filterOpen, setFilterOpen] = useState(false);
  const [isAscending, setIsAscending] = useState<Boolean>(false);
  const [sort, setSort] = useState<{
    column: string;
    order: "ASC" | "DESC";
  }>({ column: "", order: "ASC" });
  const [pagination, dispatch] = useReducer(
    paginationReducer,
    paginationInitialState
  );

  const updateTaskStatus = (task: any) => {
    setTasks((prev) => {
      return prev.filter((t) => t.id != task.id);
    });
  };

  const handleFilter = (filter: Record<string, any>) => {
    setPriorities(filter.priorities);
    setTags(filter.tags)
    setFilterOpen(false);
  };

  const openSnoozeModal = (task: any) => {
    setSnoozeModalOpen(true);
    setSelectedTask(task);
  };

  const closeSnoozeModal = () => {
    setSnoozeModalOpen(false);
  };

  const openFilter = () => setFilterOpen(true);

  const handleSnooze = () => {
    setSnoozeModalOpen(false);
    getTasks();
  };

  const getTasks = useCallback(async () => {
    const page = parsePage(router.query.page);
    const _orderBy = !isAscending ? "DESC" : "ASC";
    const sortOptions = [{ column: "STATUS", order: _orderBy }];
    if (sort.column) {
      sortOptions.push(sort);
    }
    try {
      const data = await $gql({
        query: TASKS_QUERY,
        variables: {
          page,
          status,
          priorities,
          tags,
          orderBy: sortOptions,
        },
      });
      setTasks(data.tasks.data);
      dispatch({
        type: "set",
        value: data.tasks.paginatorInfo,
      });
    } catch (error) { }
  }, [router.query.page, status, priorities, isAscending, sort, tags]);

  const toggleViewType = () => {
    setViewType((prev) => (prev === "grid" ? "list" : "grid"));
  };

  useEffect(() => {
    getTasks();
  }, [getTasks]);

  const compare = (source: Task[], type: string, value: string) => {
    let copied: any = [];
    if (type === "priority") {
      source.forEach(task => {
        if (parseInt(task.priority) === parseInt(value)) {
          copied.unshift(task)
        } else {
          copied.push(task)
        }
      });
    } else {
      source.forEach(task => {
        let tag = task.tags.find((_tag: { id: string, name: string }) => _tag.id === value);
        if (tag) {
          copied.unshift(task)
        } else {
          copied.push(task)
        }
      });
    }
    return copied;
  }

  const onSortOnPage = (type: string, value: string) => {
    let copiedTasks = [...tasks];
    setTasks(compare(copiedTasks, type, value))
  }

  return (
    <>
      <div className="py-4 border-t pb-0 sm:pb-4">
        <div className="container px-4 mx-auto">
          <div className="flex items-center justify-end space-x-3">
            <button
              type="button"
              className="p-3 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-600 focus:ring-white"
              onClick={toggleViewType}
            >
              {viewType === "list" ? <ListIcon /> : <GridIcon />}
            </button>
            <Link href={`/dashboard/${router.query.case}/tasks/create`}>
              <a className={$theme.button()}>Add +</a>
            </Link>
          </div>
        </div>
      </div>

      <div className="py-4">
        <div className="container px-4 mx-auto">
          <div className=" flex flex-col justify-between items-center mb-4 sm:flex-row">
            <h1 className="font-semibold text-2xl text-natural-13 mb-3 sm:mb-0">To Do</h1>
            <div className="flex space-x-2">
              <div className="relative">
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  onClick={openFilter}
                >
                  <FilterIcon className="h-5 w-5 -mx-px mr-2" />
                  Filter
                </button>
                <PriorityFilter
                  open={filterOpen}
                  onClose={setFilterOpen}
                  onFilter={handleFilter}
                />
              </div>

              {status === "all" && <button
                type="button"
                onClick={() => setIsAscending(prev => !prev)}
                className={classNames(
                  "inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs",
                  "font-medium rounded text-gray-700 focus:ring-offset-2 focus:ring-indigo-500 focus:outline-none focus:ring-2",
                  status === "all" ? "hover:bg-gray-50 bg-white" : "bg-gray-50 opacity-60"
                )}
              >
                {isAscending ? <SortAscendingIcon className="h-5 w-5" /> : <SortDescendingIcon className="h-5 w-5" />}
                <span className="ml-1 text-sm text-[#290064]">Sort</span>
              </button>}
              <TaskFilter value={status} onChangeValue={setStatus} />
            </div>
          </div>
          {viewType === "list" ? (
            <TaskLists
              tasks={tasks}
              updateTaskStatus={updateTaskStatus}
              openSnoozeModal={openSnoozeModal}
              setSort={setSort}
              sort={sort}
            />
          ) : (
            <TaskGrid
              tasks={tasks}
              updateTaskStatus={updateTaskStatus}
              openSnoozeModal={openSnoozeModal}
              onSortOnPage={onSortOnPage}
            />
          )}
          <div className="px-4 py-2 bg-white mt-4">
            <Pagination data={pagination} />
          </div>
        </div>
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

export default withDashboardLayout(TasksPage, "Court - Task Checklist");

interface Task {
  id: string
  user_id: string
  name: string
  category: string
  description: string
  priority: string
  priority_name: "string"
  status: string
  due_date: string
  tags: [{
    id: string
    name: string
  }]
}
