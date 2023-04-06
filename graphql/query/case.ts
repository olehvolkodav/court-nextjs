export const MY_CASE_QUERY = `
query(
  $id: ID!
) {
  courtCase: my_case(id: $id) {
    id
    name
    status
    country
    city
    state
    body
    judge_name
    case_number
    address
    date
    userRole
    email
    users {
      id
      name
      email
      username
      party {
        role
      }
    }
  }
}
`

export const MY_FIRST_CASE_QUERY = `
query {
  courtCase: my_first_case {
    id
    name
    status
    city
    state
    body
    country
    judge_name
    case_number
    address
    date
    users {
      id
      name
      email
      username
      party {
        role
      }
    }
  }
}
`
