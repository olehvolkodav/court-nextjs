import { PageHeader } from "@/components/dashboard/PageHeader";
import { TaskForm } from "@/components/task/TaskForm";
import { withDashboardLayout } from "@/hoc/layout";
import { NextPageWithLayout } from "@/interfaces/page.type";

const CreateTaskPage: NextPageWithLayout = () => {
  return (
    <>
      <div className="py-4">
        <div className="container px-4 mx-auto">
          <PageHeader title="Add New To Do" className="mb-4" />

          <TaskForm />
        </div>
      </div>
    </>
  )
}

export default withDashboardLayout(CreateTaskPage, "Court - Create To Do")
