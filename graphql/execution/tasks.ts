import { gql, useQuery } from "@apollo/client"
import { TASKS_QUERY } from "../query/tasks";

export const useAllTasksQuery = () => {
  const { data, loading, refetch } = useQuery(gql`${TASKS_QUERY}`);

  return {
    all_tasks: data?.tasks?.data ?? [],
    loading,
    refetch,
  }
}
