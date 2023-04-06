export const PAGINATION_PARAMS = `$page: Int, $first: Int`

export const PAGINATION_VARS = `page: $page, first: $first`

export const PAGINATION_FIELD = `
  paginatorInfo {
    count
    currentPage
    lastPage
    perPage
    hasMorePages
    total
  }
`

export function parsePage(page: string | string[] | undefined) {
  if (!page) {
    return 1;
  }

  if (typeof page === 'string') {
    return parseInt(page);
  }

  return 1;
}