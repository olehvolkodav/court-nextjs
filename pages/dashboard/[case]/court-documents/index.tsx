import React, { useEffect, useMemo, useReducer, useState } from "react";
import { FileSlider } from "@/components/file/FileSlider";
import { Badge } from "@/components/ui/Badge";
import { NextLink } from "@/components/ui/link";
import { Pagination } from "@/components/ui/pagination";
import { DEFAULT_FILE_QUERY } from "@/graphql/query/file";
import {
  PAGINATION_FIELD,
  PAGINATION_PARAMS,
  PAGINATION_VARS,
  parsePage,
} from "@/graphql/query/util";
import { withDashboardLayout } from "@/hoc/layout";
import { NextPageWithLayout } from "@/interfaces/page.type";
import { $date } from "@/plugins/date";
import { $gql } from "@/plugins/http";
import {
  paginationInitialState,
  paginationReducer,
} from "@/reducers/pagination.reducer";
import { $fileActions } from "@/store/file.store";
import { $theme } from "@/theme";
import {
  PencilIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  FilterIcon,
} from "@heroicons/react/outline";
import {
  COURT_ORDERS,
  MY_PLEADINGS,
  OPPOSITION_PLEADINGS,
} from "@/components/court-document/constants";
import Link from "next/link";
import { useRouter } from "next/router";
import { classNames } from "@/utils/classname";
import { CourtDocumentFilter } from "@/components/court-document/CourtDocumentFilter";
import CourtDox from "@/components/cardview/CourtDox";

const color = {
  [MY_PLEADINGS]: "blue",
  [OPPOSITION_PLEADINGS]: "green",
  [COURT_ORDERS]: "red",
};

const COURT_DOCUMENTS_QUERY = `
  query(${PAGINATION_PARAMS}) {
    court_documents: my_court_documents(${PAGINATION_VARS}) {
      ${PAGINATION_FIELD}
      data {
        ${DEFAULT_FILE_QUERY}
        meta {
          category
        }
        parent {
          id
        }
        fileable {
          ... on CourtDocument {
            id
            title
            date
            tags {
              id
              name
            }
          }
        }
      }
    }
  }
`;

const TABLE_HEADERS = [
  { title: "Category" },
  { title: "Title", sortOptions: { dataType: "string", key: "title" } },
  { title: "File Name", sortOptions: { dataType: "string", key: "fileName" } },
  { title: "Tags" },
  { title: "Date", sortOptions: { dataType: "string", key: "date" } },
  { title: "" },
];

const CourtDocumentsPage: NextPageWithLayout = () => {
  const router = useRouter();
  const [sort, setSort] = useState<{
    field: string;
    sortType: "asc" | "desc" | null;
  }>({ field: "", sortType: null });
  const [courtDocuments, setCourtDocuments] = useState<any[]>([]);
  const [filter, setFilter] = useState<{ value: string; name: string }[]>([]);
  const [pagination, dispatch] = useReducer(
    paginationReducer,
    paginationInitialState
  );
  const [sliderOpen, setSliderOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);

  const toggleFilter = () => setFilterOpen(!filterOpen);
  const closeFilter = () => setFilterOpen(false)

  const handleFileClick = (file: any) => () => {
    $fileActions.setSlideFile(file);
    setSliderOpen(true);
  };

  useEffect(() => {
    const page = parsePage(router.query.page);

    const getCourtDocuments = async () => {
      try {
        const data = await $gql({
          query: COURT_DOCUMENTS_QUERY,
          variables: { page },
        });

        setCourtDocuments(data.court_documents.data);
        dispatch({
          type: "set",
          value: data.court_documents.paginatorInfo,
        });
      } catch (error) { }
    };

    getCourtDocuments();
  }, [router.query.page]);

  const compare = (field, type) => (a, b) => {
    let leftValue, rightValue;
    switch (field) {
      case "title":
        leftValue = a.fileable.title;
        rightValue = b.fileable.title;
        break;
      case "date":
        leftValue = a.fileable?.date;
        rightValue = b.fileable?.date;
        break;
      case "fileName":
      default:
        leftValue = a.name;
        rightValue = b.name;
        break;
    }
    switch (type) {
      case "date":
        return new Date(leftValue).getTime() - new Date(rightValue).getTime();
      case "string":
      default:
        if (leftValue < rightValue) return -1;
        if (leftValue > rightValue) return 1;
        return 0;
    }
  };

  useEffect(() => {
    if (sort.field) {
      const copiedDocument = [...courtDocuments];
      const data = TABLE_HEADERS.find(
        (header) => header.sortOptions?.key === sort.field
      );
      if (data) {
        copiedDocument.sort(compare(sort.field, data.sortOptions?.dataType));
        if (sort.sortType === "desc") {
          copiedDocument.reverse();
        }
        setCourtDocuments([...copiedDocument]);
      }
    }
  }, [sort]);

  const handleSort = (field: string, sortType: any) => {
    setSort({ field, sortType });
  };

  const handleFilter = (filter: Record<string, any>) => {
    setFilter(filter.categories);
    setFilterOpen(false);
  };

  const filteredData = useMemo(() => {
    if (!filter.length) return courtDocuments;
    const values = filter.map((f) => f.value);
    return courtDocuments.filter((document) =>
      values.includes(document.meta.category)
    );
  }, [courtDocuments, filter]);

  return (
    <div className="py-4">
      <div className="container px-4 mx-auto">
        <div className="flex justify-between items-center mb-4 flex-col sm:flex-row">
          <h1 className="text-2xl text-natural-13 font-medium mb-3 sm:mb-0">
            Court Documents
          </h1>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button
                type="button"
                className="inline-flex items-center px-4 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                onClick={toggleFilter}
              >
                <FilterIcon className="h-5 w-5 -mx-px mr-2" />
                Filter
              </button>
              <CourtDocumentFilter
                onFilter={handleFilter}
                open={filterOpen}
                onClose={closeFilter}
              />
            </div>
            <Link
              href={`/dashboard/${router.query.case}/court-documents/create`}
            >
              <a className={classNames($theme.button(), "py-3")}>Add +</a>
            </Link>
          </div>
        </div>
        <div className="rounded-lg overflow-hidden hidden sm:flex">
          <table className="x-2-table">
            <thead>
              <tr>
                {TABLE_HEADERS.map((header) => (
                  <th
                    key={header.title}
                    onClick={() => {
                      if (header.sortOptions) {
                        handleSort(
                          header.sortOptions?.key,
                          sort.sortType === "asc" ? "desc" : "asc"
                        );
                      }
                    }}
                  >
                    <div
                      className={classNames(
                        "flex gap-2 select-none",
                        header.sortOptions && "cursor-pointer",
                        header.sortOptions?.key === sort.field &&
                        "text-indigo-700"
                      )}
                      role="button"
                    >
                      {header.title}{" "}
                      {header.sortOptions && (
                        <>
                          {sort.field === header.sortOptions.key &&
                            sort.sortType === "desc" ? (
                            <ChevronDownIcon className="w-4" />
                          ) : (
                            <ChevronUpIcon className="w-4" />
                          )}
                        </>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {filteredData.map((courtDocument) => (
                <tr key={courtDocument.id}>
                  <td className="capitalize">
                    <Link
                      href={`/dashboard/${router.query.case}/files/${courtDocument.parent.id}`}
                    >
                      <a>
                        <Badge
                          className="list-inside list-item w-max"
                          color={color[courtDocument.meta.category]}
                        >
                          {courtDocument.meta.category?.replace("_", " ")}
                        </Badge>
                      </a>
                    </Link>
                  </td>
                  <td>
                    <Link
                      href={`/dashboard/${router.query.case}/court-documents/${courtDocument.fileable.id}/edit`}
                    >
                      <a className="text-lg font-medium">
                        {courtDocument.fileable.title}
                      </a>
                    </Link>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="text-lg font-medium"
                      onClick={handleFileClick(courtDocument)}
                    >
                      {courtDocument.name}
                    </button>
                  </td>
                  <td>
                    <div className="flex space-x-1">
                      {courtDocument.fileable?.tags?.map((tag: any) => (
                        <Badge key={`tag-${tag.id}`} className="capitalize">
                          {tag.name.replace("-", " ")}
                        </Badge>
                      ))}
                    </div>
                  </td>
                  <td>
                    {$date(courtDocument.fileable?.date ?? null).format(
                      "MM-DD-YYYY"
                    )}
                  </td>
                  <td className="flex items-center gap-4">
                    <button
                      onClick={handleFileClick(courtDocument)}
                      className="bg-transparent hover:bg-primary-1 text-primary-1 font-medium hover:text-white py-2 px-4 border border-primary-1 hover:border-transparent rounded"
                    >
                      View
                    </button>
                    <NextLink
                      href={`/dashboard/${router.query.case}/court-documents/${courtDocument.fileable.id}/edit`}
                    >
                      <a>
                        <PencilIcon className="h-6 w-6" />
                      </a>
                    </NextLink>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="px-4 py-2 bg-white mt-4">
            <Pagination data={pagination} />
          </div>
        </div>
        <CourtDox filteredData={filteredData} />
        <FileSlider
          open={sliderOpen}
          onClose={setSliderOpen}
          allowDelete={false}
        />
      </div>
    </div>
  );
};

export default withDashboardLayout(
  CourtDocumentsPage,
  "Court - Court Documents"
);
