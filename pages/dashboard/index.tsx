import { CaseForm } from "@/components/case/CaseForm";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { EagerLoad } from "@/components/fetching/EagerLoad";
import { FullscreenLoading } from "@/components/ui/loading";
import { withLayout } from "@/hoc/layout";
import { $gql } from "@/plugins/http";
import { $user, $userLoaded } from "@/store/auth.store";
import { $theme } from "@/theme";
import { useStore } from "effector-react";
import Link from "next/link";
import Router from "next/router";
import { useEffect, useState } from "react";

const CASE_QUERY = `
  query {
    courtCase: my_first_case {
      id
      name
    }
  }
`

const DashboardPage = () => {
  const user = useStore($user);
  const userLoaded = useStore($userLoaded);

  const [courtCase, setCourtCase] = useState<any>();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const getCase = async () => {
      try {
        const data = await $gql(CASE_QUERY);

        setCourtCase(data.courtCase);

        if (!!data.courtCase) {
          Router.replace(`/dashboard/${data.courtCase.id}`)
        }
      } catch (error) {

      } finally {
        setLoaded(true)
      }
    }

    getCase()
  }, []);

  return (
    <div className="py-4">
      <div className="container px-4 mx-auto">
        <EagerLoad
          when={userLoaded && loaded}
          loadingComponent={
            <FullscreenLoading>
              <p>Fetching Data...</p>
            </FullscreenLoading>
          }
        >
          {!courtCase && user?.isSubscribed && (
            <>
              <PageHeader title="Create Case" className="mb-4" />

              <CaseForm />
            </>
          )}

          {(!user?.isSubscribed && user?.isOwner) && (
            <div className="bg-white shadow sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="sm:flex sm:items-start sm:justify-between">
                  <div>
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Buy Court Clerk Product</h3>
                    <div className="mt-2 max-w-xl text-sm text-gray-500">
                      <p>
                        Buy product to continue using Court Clerk.
                      </p>
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-0 sm:ml-6 sm:flex-shrink-0 sm:flex sm:items-center">
                    <Link href="/products">
                      <a className={$theme.button()}>Buy Product</a>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </EagerLoad>
      </div>
    </div>
  )
}

export default withLayout(DashboardPage);
