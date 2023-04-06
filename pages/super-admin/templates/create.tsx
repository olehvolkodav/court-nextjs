import { withAdminLayout } from "@/hoc/layout";
import { TemplateForm } from "@/components/template/TemplateForm";
import { PageHeader } from "@/components/dashboard/PageHeader";

const CreateTemplatePage: React.FC = () => {
  return (
    <div className="py-4">
      <div className="container px-4 mx-auto">
        <PageHeader title="Add Template" className='mb-4' />

        <TemplateForm />
      </div>
    </div>
  )
}

export default withAdminLayout(CreateTemplatePage, "Court - Create Template");
