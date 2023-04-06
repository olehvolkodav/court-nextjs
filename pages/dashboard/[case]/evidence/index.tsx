import React, { useEffect, useState } from "react";
import type { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";

import { EvidenceList } from "@/components/evidence/EvidenceList";
import { EvidenceFilter } from "@/components/evidence/EvidenceFilter";
import { DownloadIcon } from "@heroicons/react/outline";
import { FileSlider } from "@/components/file/FileSlider";
import { Button } from "@/components/ui/button";

import { useAllEvidenceQuery } from "@/graphql/execution/evidence";
import { withDashboardLayout } from "@/hoc/layout";
import { $theme } from "@/theme";
import { $http } from "@/plugins/http";
import { useDownload } from "@/hooks/download.hook";

const EvidencePage: NextPage = () => {
  const router = useRouter();
  const { all_evidence, loading, refetch } = useAllEvidenceQuery();
  const { windowDownload } = useDownload();

  const [filter, setFilter] = useState<string>("positive");
  const [evidences, setEvidences] = useState<any[]>([]);

  useEffect(() => {
    setEvidences(all_evidence);
  }, [all_evidence]);

  const download = async () => {
    const { data } = await $http.post(
      "/evidence/download",
      {},
      { responseType: "blob" }
    );

    windowDownload(data, `evidence_${Date.now()}.pdf`);
  };

  React.useEffect(() => {
    refetch({ signType: filter });
  }, [filter, refetch]);

  return (
    <>
      <div className="pt-4 pb-24">
        <div className="container px-4 mx-auto">
          <div className="flex mb-4 justify-between flex-col sm:flex-row">
            <h1 className="font-semibold text-2xl text-natural-13 mb-3 text-center sm:mb-0 text-left">
              My Evidence
            </h1>

            <div className="flex items-center space-x-4 justify-center  ">
              <EvidenceFilter value={filter} onChangeValue={setFilter} />

              <Link href={`/dashboard/${router.query.case}/evidence/create`}>
                <a className={$theme.button()}>+ Add Evidence</a>
              </Link>

              <Button color="default" onClick={download}>
                <DownloadIcon className="h-6 w-6" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols lg:grid-cols-2 gap-4">
            {!loading && (
              <>
                {evidences.length ? (
                  evidences.map((evidence: any) => (
                    <EvidenceList key={evidence.id} evidence={evidence} />
                  ))
                ) : (
                  <div className="lg:col-span-2">
                    <p>You dont have any evidence</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <FileSlider allowDelete={false} onUpdate={refetch} />
    </>
  );
};

export default withDashboardLayout(EvidencePage, "Court - My Evidence");
