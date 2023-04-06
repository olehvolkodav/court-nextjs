import { CourtDocumentForm } from "@/components/court-document/CourtDocumentForm";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { withDashboardLayout } from "@/hoc/layout";
import { NextPageWithLayout } from "@/interfaces/page.type";

const CreateCourtDocumentsPage: NextPageWithLayout = () => {
  return (
    <div className="py-4">
      <div className="container px-4 mx-auto">
        <PageHeader title="Add Document" className="mb-4" />

        <CourtDocumentForm />
      </div>
    </div>
  )
}

export default withDashboardLayout(CreateCourtDocumentsPage, "Court - Add Court Documents");
