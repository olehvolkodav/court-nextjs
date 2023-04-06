import { DEFAULT_FILE_QUERY } from "./file";

export const MY_TIMELINE_QUERY = `
query(
  $types: [String!], $orderBy: [QueryActivitiesOrderByOrderByClause!], $extension: String,
  $tags: [String!]
) {
  activities(first:10000, types: $types, orderBy: $orderBy, extension: $extension, tags: $tags) {
    data {
      id
      log_name
      description
      created_at
      updated_at
      subject {
        __typename
        ... on Evidence {
          id
          title
          main_points
          prove_explanation
          date_occurred
          sign_type
          files {
            ${DEFAULT_FILE_QUERY}
          }
          user {
            id
            email
          }
          witnesses {
            id
            name
            email
            relation
            organization
            files {
              ${DEFAULT_FILE_QUERY}
            }
          }
        }
        ... on File {
          ${DEFAULT_FILE_QUERY}
        }
        ... on CourtCase {
          id
          status
          caseName: name
          city
          state
          body
        }
      }
    }
  }
}
`;
