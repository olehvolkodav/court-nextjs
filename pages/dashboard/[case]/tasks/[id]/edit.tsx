import { PageHeader } from "@/components/dashboard/PageHeader";
import { TaskForm } from "@/components/task/TaskForm";
import { withDashboardLayout } from "@/hoc/layout";
import { NextPageWithLayout } from "@/interfaces/page.type";
import { $gql } from "@/plugins/http";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const FIND_TASK_QUERY = `
  query($id: ID!) {
    task: my_task(id: $id) {
      id
      name
      description
      category
      priority
      status
      due_date
      location
      time
      tags {
        id
        name
      }
    }
  }
`

const EditTaskPage: NextPageWithLayout = () => {
  const router = useRouter();

  const [task, setTask] = useState<any>();

  useEffect(() => {
    const id = router.query.id;

    const findTask = async() => {
      try {
        const data = await $gql({
          query: FIND_TASK_QUERY,
          variables: { id }
        });

        setTask(data.task);
      } catch (error) {
        //throw 404?
      }
    }

    findTask()
  }, [router.query.id]);

  return (
    <>
      <div className="py-4">
        <div className="container px-4 mx-auto">
          <PageHeader title="Edit To Do" className="mb-4" />

          {!!task && <TaskForm task={task} />}
        </div>
      </div>
    </>
  )
}

export default withDashboardLayout(EditTaskPage, "Court - Edit To Do")
