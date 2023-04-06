import { NextPage } from "next";
import React, { useState } from "react";
import { $http } from "@/plugins/http";
import { useRouter } from "next/router";
import { useToast } from "@/hooks/toast.hook";
import { useApolloClient } from "@apollo/client";
import { EvidenceForm } from "@/components/evidence/EvidenceForm";
import { useEvidenceQuery } from "@/graphql/execution/evidence";
import { withDashboardLayout } from "@/hoc/layout";
import { EvidenceQuestion } from "@/components/evidence/EvidenceQuestion";

const EditEvidencePage: NextPage = () => {
  const apolloClient = useApolloClient();

  const router = useRouter();

  const [evidence] = useEvidenceQuery(router.query.id);

  const toast = useToast();

  const [loading, setLoading] = useState(false);

  const filesOnly = React.useMemo(() => {
    return router.query.type === "files-only";
  }, [router.query.type]);

  const updateEvidence = async(data: Record<string, any>) => {
    setLoading(true);

    try {
      await $http.patch(`/evidence/${evidence.id}`, data);

      toast.show({message: "Evidence Created!"});

      apolloClient.cache.evict({
        id: "ROOT_QUERY",
        fieldName: "my_all_evidence"
      });

      router.replace(`/dashboard/${router.query.case}/evidence`);
    } catch (error) {

    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="py-4">
        <div className="container px-4 mx-auto">
          <div className="flex mb-4">
            <h1 className="font-medium text-2xl text-gray-800">Edit Evidence</h1>
          </div>

          <div className="grid grid-cols lg:grid-cols-12 gap-4">
            <div className="lg:col-span-8">
              {!!evidence && (
                <EvidenceForm filesOnly={filesOnly} loading={loading} onSubmit={updateEvidence} evidence={evidence} />
              )}
            </div>

            {!filesOnly && (
              <div className="lg:col-span-4">
                <EvidenceQuestion />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default withDashboardLayout(EditEvidencePage, "Court - Edit Evidence");
