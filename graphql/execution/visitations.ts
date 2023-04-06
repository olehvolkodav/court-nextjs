import { gql, useQuery } from "@apollo/client";
import { VISITATIONS_QUERY } from "../query/visitations";

export const useAllVisitationsQuery = () => {
  const { data, loading, refetch } = useQuery(gql`${VISITATIONS_QUERY}`);

  return {
    all_visitations: data?.visitation_schedules ?? [],
    loading,
    refetch,
  }
}
