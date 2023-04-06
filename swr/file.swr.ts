import { DEFAULT_FILE_QUERY } from "@/graphql/query/file";
import useSWR from "swr";
import { $gql } from "@/plugins/http";

const FIND_FILE_QUERY = `
  query ($id: ID!) {
    file(id: $id) {
      ${DEFAULT_FILE_QUERY}
      comments {
        data {
          id
          body
          created_at
          user {
            id
            name
          }
          parent {
            id
          }
        }
      }
      shares {
        id
        name
      }
      parent {
        is_shared
      }
    }
  }
`;

export const useFile = (id?: string) => {
  const { data, error, mutate } = useSWR(
    id ? `file-detail-query-${id}` : null,
    async () => {
      return $gql({
        query: FIND_FILE_QUERY,
        variables: { id },
      }).then((data) => data.file);
    },
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
    }
  );

  const loading = !data && !error;

  return [data, loading, error, mutate] as const;
};
