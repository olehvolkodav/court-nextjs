import { ChevronRightIcon } from "@heroicons/react/outline";
import Link from "next/link";
import { useRouter } from "next/router";

interface Props {
  breadcrumbs: any[];
  isIndex?: boolean;
  folder?: any;
}

export const FileBreadcrumb: React.FC<Props> = ({
  breadcrumbs,
  isIndex,
  folder,
}) => {
  const router = useRouter();

  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol role="list" className="flex items-center space-x-4">
        <li>
          <div>
            <Link href={`/dashboard/${router.query.case}/files`}>
              <a className="text-2xl text-natural-13 font-medium hover:text-gray-700">
                File History
              </a>
            </Link>
          </div>
        </li>
        {breadcrumbs.map((page) => (
          <li key={page.name}>
            <div className="flex items-center">
              <ChevronRightIcon
                className="flex-shrink-0 h-5 w-5 text-gray-400"
                aria-hidden="true"
              />

              <Link
                href={{
                  pathname: "/dashboard/[case]/files/[id]",
                  query: {
                    id: page.id,
                    case: router.query.case,
                  },
                }}
              >
                <a className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700">
                  {page.name}
                </a>
              </Link>
            </div>
          </li>
        ))}

        {!isIndex && (
          <li>
            <div className="flex items-center">
              <ChevronRightIcon
                className="flex-shrink-0 h-5 w-5 text-gray-400"
                aria-hidden="true"
              />

              <span className="ml-4 text-sm font-medium text-gray-500">
                {folder?.name}
              </span>
            </div>
          </li>
        )}
      </ol>
    </nav>
  );
};
