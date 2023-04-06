export const DEFAULT_FILE_QUERY = `
  id
  name
  path
  size
  type
  ext
  disk
  created_at
  is_reserved
  is_private
  status
  tags {
    id
    name
  }
  isOwner
`

export const SUB_FOLDER_QUERY = `
  query($id: ID!) {
    folder: my_file(id: $id) {
      ${DEFAULT_FILE_QUERY}
      children(orderBy: [{column: TYPE, order: DESC}, {column: ORDER, order: ASC}]) {
        ${DEFAULT_FILE_QUERY}
      }
      ancestors {
        id
        name
      }
    }
  }
`

export const ROOT_FOLDER_QUERY = `
  query {
    folder: my_root_file {
      ${DEFAULT_FILE_QUERY}
      children(orderBy: [{column: TYPE, order: DESC}]) {
        ${DEFAULT_FILE_QUERY}
      }
    }
    share_files: my_share_files {
      ${DEFAULT_FILE_QUERY}
    }
  }
`
export const CASE_FOLDER_QUERY = `
  query($case: ID!) {
    courtCase: my_case(id: $case) {
      id
      folder {
        ${DEFAULT_FILE_QUERY}
        children(orderBy: [{column: TYPE, order: DESC}, {column: ORDER, order: ASC}]) {
          ${DEFAULT_FILE_QUERY}
        }
      }
    }
    share_files: my_share_files {
      ${DEFAULT_FILE_QUERY}
    }
  }
`
