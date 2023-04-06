import { gql, useQuery } from "@apollo/client";
import { CALENDAR_QUERY } from "../query/journals";


export const useAllCalenderQuery = () => {
  const { data, loading, refetch } = useQuery(gql`${CALENDAR_QUERY}`);
  return {
    all_calenders: data,
    loading: loading,
    refetch: refetch
  }
}
