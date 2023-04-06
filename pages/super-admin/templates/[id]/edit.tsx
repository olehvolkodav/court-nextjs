import { withAdminLayout } from "@/hoc/layout";
import { TemplateForm } from "@/components/template/TemplateForm";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { $gql } from "@/plugins/http";

const EditTemplatePage: React.FC = () => {
  const router = useRouter();

  const [template, setTemplate] = useState<any>();

  useEffect(() => {
    const id = router.query.id as string;

    const getTemplate = async() => {
      try {
        const data = await $gql({
          query: `
            query($id: ID!) {
              template: admin_template(id: $id) {
                id
                name
                body
                subject
                description
              }
            }
          `,
          variables: { id }
        });

        setTemplate(data.template);
      } catch (error) {

      }
    }

    getTemplate()
  }, [router.query.id])

  return (
    <div className="py-4">
      <div className="container px-4 mx-auto">
        <PageHeader title="Edit Template" className='mb-4' />

        {!!template && (
          <TemplateForm template={template} />
        )}
      </div>
    </div>
  )
}

export default withAdminLayout(EditTemplatePage, "Court - Edit Template");
