import React, { useEffect } from "react";
import { DownloadIcon } from "@heroicons/react/outline";
import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { EmptyState } from "@/components/EmptyState";
import { FileSlider } from "@/components/file/FileSlider";
import { Button } from "@/components/ui/button";
import { WitnessList } from "@/components/witness/WitnessList";
import { DEFAULT_FILE_QUERY } from "@/graphql/query/file";
import { withDashboardLayout } from "@/hoc/layout";
import { useDownload } from "@/hooks/download.hook";
import { $gql, $http } from "@/plugins/http";
import { $theme } from "@/theme";

const MY_WITNESSES_QUERY = `
  query {
    my_witnesses {
      id
      name
      email
      phone
      type
      relation
      status
      organization
      address
      main_points
      label
      created_at
      files {
        ${DEFAULT_FILE_QUERY}
      }
    }
  }
`

const WitnessPage: NextPage = () => {
  const router = useRouter();
  const [witnesses, setWitnesses] = React.useState<any[]>([]);
  const [loaded, setLoaded] = React.useState(false);
  const { windowDownload } = useDownload();

  const download = async () => {
    const { data } = await $http.post("/witnesses/download", {

    }, { responseType: "blob" })

    windowDownload(data, `witnesses_${Date.now()}.pdf`)
  }

  React.useEffect(() => {
    const getWitnesses = async () => {
      try {
        const { my_witnesses } = await $gql(MY_WITNESSES_QUERY);

        setWitnesses(my_witnesses);
      } catch (error) {

      } finally {
        setLoaded(true);
      }
    }

    getWitnesses()
  }, []);

  useEffect(() => {
    if (loaded && !!window.location.hash) {
      const element = document.querySelector(window.location.hash);

      element?.scrollIntoView();
    }
  }, [loaded]);

  return (
    <div className="py-4">
      <div className="container px-4 mx-auto">
        <div className="flex justify-between items-center mb-4 flex-col sm:flex-row">
          <h1 className="font-semibold text-2xl text-natural-13  mb-3 sm:mb-0">
            My Witnesses
          </h1>

          <div className="flex space-x-2">
            <Link href={`/dashboard/${router.query.case}/witnesses/create`}>
              <a className={$theme.button()}>
                + Add Witness
              </a>
            </Link>
            <Button color="default" onClick={download}>
              <DownloadIcon className="h-6 w-6" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols gap-4">
          {
            witnesses.map((witness: any) => (
              <WitnessList witness={witness} key={witness.id} />
            ))
          }

          {!witnesses.length && (
            <EmptyState title="No Witnesses" />
          )}
        </div>
      </div>

      <FileSlider allowDelete={false} />
    </div>
  )
}

export default withDashboardLayout(WitnessPage, "Court - My Witnesses");
