export const VOICE_MEMO = `
query {
  my_transcripts {
    id
    name
    result
    voice {
      id
      name
      url
      created_at
    }
    pdf {
      id
      name
      url
      created_at
    }
  }
}
`;
