import { useCaseQuery } from "@/graphql/execution/case";
import { WatchQueryFetchPolicy } from "@apollo/client";
import { useRouter } from "next/router";
import { useCallback } from "react";

export const useCaseDashboard = (fetchPolicy?: WatchQueryFetchPolicy) => {
  const router = useRouter();

  return useCaseQuery({
    variables: { id: router.query.case },
    skip: !router.query.case,
    fetchPolicy
  })
}

export const useCaseRouter = () => {
  const router = useRouter();
  const [courtCase] = useCaseDashboard();

  const replace = useCallback((url: string) => {
    return router.replace(`/dashboard/${courtCase?.id}/${url}`)
  }, [courtCase?.id, router]);

  const push = useCallback((url: string) => {
    return router.push(`/dashboard/${courtCase?.id}/${url}`)
  }, [courtCase?.id, router]);

  return { replace, push }
}
