import { classNames } from "@/utils/classname";
import { ArrowNarrowLeftIcon, ArrowNarrowRightIcon } from "@heroicons/react/solid"
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

export interface ICenterPaginationProps extends React.HTMLAttributes<HTMLElement> {
  data: any;
}

export const CenterPagination: React.FC<ICenterPaginationProps> = ({data, ...rest}) => {
  const router = useRouter();

  const shouldRenderPage = React.useMemo(() => {
    return data.total !== data.count;
  }, [data.total, data.count]);

  if (!shouldRenderPage) {
    return null;
  }

  return (
    <nav className={
      classNames(
        "border-t border-gray-200 px-4 flex items-center justify-between sm:px-0",
        rest.className,
      )
    }>
      {data.currentPage > 1 && (
        <div className="-mt-px w-0 flex-1 flex">
          <Link href={{
            pathname: router.pathname,
            query: {
              ...router.query,
              page: data.currentPage - 1,
            }
          }}>
            <a
              className="border-t-2 border-transparent pt-4 pr-1 inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
            >
              <ArrowNarrowLeftIcon className="mr-3 h-5 w-5 text-gray-400" aria-hidden="true" />
              Previous
            </a>
          </Link>
        </div>
      )}

      {data.hasMorePages && (
        <div className="-mt-px w-0 flex-1 flex justify-end">
          <Link href={{
            pathname: router.pathname,
            query: {
              ...router.query,
              page: data.currentPage + 1,
            }
          }}>
            <a
              className="border-t-2 border-transparent pt-4 pl-1 inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
            >
              Next
              <ArrowNarrowRightIcon className="ml-3 h-5 w-5 text-gray-400" aria-hidden="true" />
            </a>
          </Link>
        </div>
      )}
    </nav>
  )
}
