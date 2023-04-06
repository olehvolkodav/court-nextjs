import { classNames } from "@/utils/classname";
import { useRouter } from "next/router";
import React from "react";
import { NextLink } from "../link";

export interface IPaginationProps extends React.HTMLAttributes<HTMLElement> {
  // Pagination data
  data: any;

  withResult?: boolean

  queryName?: string;
}

export const Pagination: React.FC<IPaginationProps> = ({data, withResult, queryName, ...rest}) => {
  const router = useRouter();

  const changePage = React.useCallback((page: number) => {

  }, []);

  const fromResult = React.useMemo(() => {
    if (data.currentPage && data.perPage) {
      return (data.currentPage * data.perPage) - data.perPage + 1;
    }

    return 1;
  }, [data.currentPage, data.perPage])

  const toResult = React.useMemo(() => {
    if (data.currentPage && data.perPage) {
      return fromResult + data.count - 1;
    }

    return 1;
  }, [fromResult, data.count, data.currentPage, data.perPage])

  return (
    <nav
      aria-label="Pagination"
      {...rest}
      className={
        classNames(rest.className, "flex items-center justify-between")
      }
    >
      <div className="hidden sm:block">
        <p className="text-sm text-gray-700">
          Showing <span className="font-medium">{fromResult}</span> to <span className="font-medium">{toResult}</span> of{" "}
          <span className="font-medium">{data.total || 0}</span> results
        </p>
      </div>
      <div className="flex-1 flex justify-between sm:justify-end">
        {!(data?.currentPage <= 1) ? (
          <NextLink
            href={{
              pathname: router.pathname,
              query: {
                ...router.query,
                page: data.currentPage - 1
              }
            }}
          >
            <a className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Previous
            </a>
          </NextLink>
        ): (
          <button type="button" disabled className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white disabled:opacity-50">
            Previous
          </button>
        )}

        {data?.hasMorePages ? (
          <NextLink
            href={{
              pathname: router.pathname,
              query: {
                ...router.query,
                page: data.currentPage + 1
              }
            }}
          >
            <a className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Next
            </a>
          </NextLink>
        ) : (
          <button type="button" disabled className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white disabled:opacity-50">
            Next
          </button>
        )}
      </div>
    </nav>
  )
}

Pagination.defaultProps = {
  withResult: false,
  queryName: "page",
}
