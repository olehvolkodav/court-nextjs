import React, { useEffect } from "react"
import { ReactProps } from "@/interfaces/react.props";
import Head from "next/head";
import { useStore } from "effector-react";
import { $user, $userLoaded } from "@/store/auth.store";
import { ErrorPage } from "@/components/error/ErrorPage";
import { DashboardLoading } from "@/components/dashboard/DashboardLoading";
import { NavigationMenu } from "@/components/dashboard/NavigationMenu";

type Props = ReactProps & { title?: string }

export const AdminLayout: React.FC<Props> = ({title, children}) => {
  const userLoaded = useStore($userLoaded);
  const user = useStore($user);

  const isAdmin = React.useMemo(() => {
    if (!user) {
      return false;
    }

    return !!user.roles.find((o: any) => o.name === "admin");
  }, [user]);

  useEffect(() => {
    console.log("admin layout mounted")
  }, []);

  return (
    <>
      <Head>
        <title key="title">{title || "Court"}</title>
      </Head>

      {
        !userLoaded ? <DashboardLoading /> : (
          !isAdmin ? <ErrorPage title="Unauthorized" statusCode={401} message="Unauthorized" /> : (
            <div className="h-full flex">
              <div className="flex-1 flex flex-col overflow-hidden">
                <NavigationMenu admin />

                <div className="flex-1 flex items-stretch overflow-hidden">
                  <main className="flex-1 overflow-y-auto bg-gray-100">
                    {children}
                  </main>
                </div>
              </div>
            </div>
          )
        )
      }
    </>
  )
}
