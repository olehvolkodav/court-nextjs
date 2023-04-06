import { NextPage } from "next";
import React, { useState } from "react";
import { $http } from "@/plugins/http";
import { useRouter } from "next/router";
import { useToast } from "@/hooks/toast.hook";
import { useApolloClient } from "@apollo/client";
import { EvidenceForm } from "@/components/evidence/EvidenceForm";
import { withDashboardLayout } from "@/hoc/layout";
import { EvidenceQuestion } from "@/components/evidence/EvidenceQuestion";
import { useCaseDashboard } from "@/hooks/case.hook";

const CreateEvidencePage: NextPage = () => {
  const [courtCase] = useCaseDashboard();

  const apolloClient = useApolloClient();

  const router = useRouter();
  const toast = useToast();

  const [loading, setLoading] = useState(false);

  const addEvidence = async(data: Record<string, any>) => {
    setLoading(true);

    try {
      await $http.post("/evidence", {
        ...data,
        court_case_id: courtCase.id
      });

      toast.show({message: "Evidence Created!"});

      apolloClient.cache.evict({
        id: "ROOT_QUERY",
        fieldName: "my_all_evidence"
      })

      router.replace(`/dashboard/${courtCase.id}/evidence`);
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
            <h1 className="font-medium text-2xl text-gray-800">Add Evidence</h1>
          </div>

          <div className="grid grid-cols lg:grid-cols-12 gap-4">
            <div className="lg:col-span-8">
              <EvidenceForm loading={loading} onSubmit={addEvidence} />
            </div>

            <div className="lg:col-span-4">
              <EvidenceQuestion />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default withDashboardLayout(CreateEvidencePage, "Court - Add Evidence");
