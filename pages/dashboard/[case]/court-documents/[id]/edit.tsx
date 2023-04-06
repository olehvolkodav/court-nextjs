import { CourtDocumentForm } from "@/components/court-document/CourtDocumentForm";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { DEFAULT_FILE_QUERY } from "@/graphql/query/file";
import { withDashboardLayout } from "@/hoc/layout";
import { NextPageWithLayout } from "@/interfaces/page.type";
import { $gql } from "@/plugins/http";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const FIND_COURT_DOCUMENT_QUERY = `
  query($id: ID!) {
    court_document: my_court_document(id: $id) {
      id
      title
      description
      category
      tags {
        id
        name
      }
      date
      files {
        ${DEFAULT_FILE_QUERY}
      }
    }
  }
`

const EditCourtDocumentPage: NextPageWithLayout = () => {
  const router = useRouter();
  const [courtDocument, setCourtDocument] = useState<any>();

  useEffect(() => {
    const getCourtDocument = async() => {
      const id = router.query.id;
      try {
        const data = await $gql({
          query: FIND_COURT_DOCUMENT_QUERY,
          variables: {
            id
          }
        })

        setCourtDocument(data.court_document)
      } catch (error) {

      }
    }

    getCourtDocument();
  }, [router.query.id])

  return (
    <div className="py-4">
      <div className="container px-4 mx-auto">
        <PageHeader title="Edit Court Document" className="mb-4" />

        {!!courtDocument && <CourtDocumentForm courtDocument={courtDocument} />}
      </div>
    </div>
  )
}

export default withDashboardLayout(EditCourtDocumentPage, "Court - Edit Court Documents");
