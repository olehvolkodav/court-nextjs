import { DEFAULT_FILE_QUERY } from "@/graphql/query/file";

export const VISITATIONS_QUERY = `
  query($happen: String, $orderBy: [QueryVisitationSchedulesOrderByOrderByClause!]) {
    visitation_schedules(happen: $happen, orderBy: $orderBy) {
      id
      date
      status
      confirmation_status
      time
      visitation {
        id
        title
        description
        start_at
      }
      files {
        ${DEFAULT_FILE_QUERY}
      }
    }
  }
`
