import { CaseForm } from "@/components/case/CaseForm";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { withDashboardLayout } from "@/hoc/layout";
import { NextPageWithLayout } from "@/interfaces/page.type";
import { $gql } from "@/plugins/http";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const CASE_QUERY = `
query($id: ID!) {
  courtCase: my_case(id: $id) {
    id
    name
    status
    country
    address
    city
    state
    body
    role
    date
    court_room_number
    case_number
    judge_name
  }
}
`

const CaseEditPage: NextPageWithLayout = () => {
  const router = useRouter();

  const [courtCase, setCourtCase] = useState<any>();

  useEffect(() => {
    const id = router.query.case;

    const getCourtCase = async() => {
      try {
        const data = await $gql({
          query: CASE_QUERY,
          variables: {
            id,
          },
        });

        setCourtCase(data.courtCase);
      } catch (error) {

      }
    }

    getCourtCase();
  }, [router.query.case])

  return (
    <>
      <div className="py-4">
        <div className="container px-4 mx-auto">
          <PageHeader title="Edit Case" className="mb-4" />

          {!!courtCase && <CaseForm courtCase={courtCase} />}
        </div>
      </div>
    </>
  )
}

export default withDashboardLayout(CaseEditPage, "Court - Edit Case");
