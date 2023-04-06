import { $gql } from "@/plugins/http";
import { gql, useQuery } from "@apollo/client"
import React, { useState } from "react";
import { MY_ALL_EVIDENCE, MY_EVIDENCE } from "../query/evidence"

export const useAllEvidenceQuery = () => {
  const { data, loading, refetch } = useQuery(gql`${MY_ALL_EVIDENCE}`);

  return {
    all_evidence: data?.my_all_evidence.data ?? [],
    loading,
    refetch,
  }
}

export const useEvidenceQuery = (id: any) => {
  const [loading, setLoading] = useState(true);
  const [evidence, setEvidence] = useState<any>();

  React.useEffect(() => {
    const getData = async() => {
      try {
        const data = await $gql({
          query: MY_EVIDENCE,
          variables: { id }
        });

        setEvidence(data.my_evidence);

        setLoading(false);
      } catch (error) {

      }
    }


    if (id) {
      getData();
    }
  }, [id])

  return [evidence, loading];
}