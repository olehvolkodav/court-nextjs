import { DashboardLoading } from "@/components/dashboard/DashboardLoading";
import { ReactProps } from "@/interfaces/react.props";
import React from "react";
import { useStore } from "effector-react";
import { $userLoaded } from "@/store/auth.store";
import { ErrorPage } from "@/components/error/ErrorPage";
import { NavigationMenu } from "@/components/dashboard/NavigationMenu";
import Head from "next/head";
import { useCurrentUser } from "@/hooks/user.hook";
import { useRouter } from "next/router";
import { useCaseQuery } from "@/graphql/execution/case";
import { FeedbackBanner } from "@/components/banner/FeedbackBanner";

type Props = ReactProps & { title?: string }

export const DashboardLayout: React.FC<Props> = ({children, title}) => {
  const router = useRouter();

  const userLoaded = useStore($userLoaded);
  const { user } = useCurrentUser();

  const [courtCase, loading] = useCaseQuery({
    variables: {
      id: router.query.case,
    }
  })

  // we may prevent admin accessing user dashboard later
  const isUser = React.useMemo(() => {
    if (!user) {
      return false;
    }

    return !!user.roles.find((o: any) => o.name === "user");
  }, [user]);

  React.useEffect(() => {
    console.log("dashboard layout mounted")

    return () => {
      console.log("dashboard layout unmounted")
    }
  }, []);

  return (
    <>
      {/* This will make sure default head render on server side */}
      <Head>
        <title key="title">{title || "Court"}</title>
      </Head>

      {
        !userLoaded ? <DashboardLoading /> : (
          !isUser ? <ErrorPage title="Unauthorized" statusCode={401} message="Unauthorized" /> : (
            <div className="h-full flex">
              {!loading && !!courtCase ? (
                <div className="flex-1 flex flex-col overflow-hidden">
                  <FeedbackBanner />

                  <NavigationMenu />

                  <div className="flex-1 flex items-stretch overflow-hidden">
                    <main className="flex-1 overflow-y-auto bg-gray-100">
                      {children}
                    </main>
                  </div>
                </div>
              ): (
                <ErrorPage title="Case Not Found" statusCode={404} message="Case Not Found" />
              )}
            </div>
          )
        )
      }
    </>
  )
}
