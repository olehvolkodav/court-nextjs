import { PAGINATION_FIELD, PAGINATION_PARAMS, PAGINATION_VARS } from "./util";

export const TASKS_QUERY = `
  query(${PAGINATION_PARAMS},$priorities:[String!],$tags:[String!], $status: String, $orderBy: [QueryMyTasksOrderByOrderByClause!]) {
    tasks: my_tasks(
      ${PAGINATION_VARS}
      status: $status
      priorities: $priorities
      tags: $tags
      orderBy: $orderBy
    ) {
      ${PAGINATION_FIELD}
      data {
        id
        user_id
        name
        category
        description
        priority
        priority_name
        status
        due_date
        tags {
          id
          name
        }
      }
    }
  }
`;
