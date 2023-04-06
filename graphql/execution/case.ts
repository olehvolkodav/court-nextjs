import { useMemo } from 'react';
import { MY_CASE_QUERY } from "@/graphql/query/case";
import { gql, useQuery, QueryHookOptions } from "@apollo/client";

export const useCaseQuery = (options?: QueryHookOptions) => {
  const { data, loading, refetch, error} = useQuery(gql`${MY_CASE_QUERY}`, options);

  const courtCase = useMemo(() => {
    return data?.courtCase;
  }, [data]);

  return [courtCase, loading, refetch, error] as const;
}
