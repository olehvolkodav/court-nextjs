import { DEFAULT_FILE_QUERY } from "./file";

export const MY_ALL_EVIDENCE = `
query(
  $signType: String,
) {
  my_all_evidence(
    signType: $signType
  ) {
    data {
      id
      title
      type
      date_occurred
      court_received_at
      created_at
      attached
      main_points
      prove_explanation
      who_was_present
      files {
        ${DEFAULT_FILE_QUERY}
      }
      witnesses {
        id
        name
        email
        relation
      }
    }
  }
}
`;

export const MY_EVIDENCE = `
  query($id: ID!) {
    my_evidence(id: $id) {
      id
      title
      type
      main_points
      date_occurred
      court_received_at
      sign_type
      prove_explanation
      who_was_present
      files {
        ${DEFAULT_FILE_QUERY}
      }
      witnesses {
        id
        name
        email
      }
    }
  }
`;
