import { PageHeader } from "@/components/dashboard/PageHeader";
import { EventForm } from "@/components/event/EventForm";
import { withDashboardLayout } from "@/hoc/layout";
import { NextPageWithLayout } from "@/interfaces/page.type";

const CreateEventPage: NextPageWithLayout = () => {
  return (
    <div className="py-4">
      <div className="container px-4 mx-auto">
        <PageHeader title="Add New Event" className="mb-4" />

        <EventForm />
      </div>
    </div>
  )
}

export default withDashboardLayout(CreateEventPage, "Court - Add Event");
