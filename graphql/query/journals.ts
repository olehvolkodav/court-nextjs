export const CALENDAR_QUERY = `
query($date: String) {
  journals(date: $date, orderBy: { column: CREATED_AT, order: ASC }) {
    data {
      __typename
      id
      title
      description
      date: full_date
      created_at
    }
  }
  tasks: my_tasks(date: $date, first: 30) {
    data {
      __typename
      id
      title: name
      category
      description
      priority
      date: full_date
      time
    }
  }
  events: my_events(date: $date) {
    data {
      __typename
      id
      title: name
      description: notes
      date: full_date
    }
  }
  hearings(date: $date, first: 30) {
    data {
      __typename
      id
      title: name
      description
      date: full_date
    }
  }
}
`
