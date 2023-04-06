import { MY_FIRST_CASE_QUERY } from "@/graphql/query/case";
import { $gql } from "@/plugins/http";
import useSWR from "swr"

export const useCaseSWR = (key = "my-first-case") => {
  const { data, error, mutate } = useSWR(key || null, async() => {
    try {
      const res = await $gql({
        query: MY_FIRST_CASE_QUERY
      })

      return res.courtCase ?? null;
    } catch (error) {
      return Promise.reject(error);
    }
  }, {
    revalidateOnFocus: false,
    revalidateIfStale: false,
  })

  const loading = !data && !error;

  return [data, loading, error, mutate] as const;
}
