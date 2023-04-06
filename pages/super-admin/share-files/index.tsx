import { PAGINATION_FIELD, PAGINATION_PARAMS, PAGINATION_VARS, parsePage } from "@/graphql/query/util";
import { withAdminLayout } from "@/hoc/layout";
import { NextPageWithLayout } from "@/interfaces/page.type";
import { $date } from "@/plugins/date";
import { $gql } from "@/plugins/http";
import { paginationInitialState, paginationReducer } from "@/reducers/pagination.reducer";
import { useRouter } from "next/router";
import { useEffect, useReducer, useState } from "react";

const SHARE_FILES_QUERY = `
  query(${PAGINATION_PARAMS}) {
    share_files(${PAGINATION_VARS}) {
      ${PAGINATION_FIELD}
      data {
        id
        created_at
        file {
          name
          type
          user {
            name
          }
        }
        user {
          name
        }
      }
    }
  }
`

const ShareFilesPage: NextPageWithLayout = () => {
  const router = useRouter();
  const [pagination, dispatch] = useReducer(paginationReducer, paginationInitialState);

  const [shareFiles, setShareFiles] = useState<any[]>([]);

  useEffect(() => {
    const getShareFiles = async() => {
      const page = parsePage(router.query.page);

      try {
        const data = await $gql({
          query: SHARE_FILES_QUERY,
        });

        setShareFiles(data.share_files.data);
      } catch (error) {

      }
    }

    getShareFiles()
  }, [router.query.page]);

  return (
    <div className="py-4">
      <div className="container px-4 mx-auto">
        <div className="flex justify-between mb-4">
          <h1 className="text-2xl font-medium text-natural-13">
            Files History
          </h1>
        </div>

        <div className="rounded-lg overflow-hidden">
          <table className="x-2-table overflow-x-auto">
            <thead>
              <tr>
                <th>File/Folder Name</th>
                <th>Type</th>
                <th>Date</th>
                <th>Shared To</th>
                <th>Shared By</th>
              </tr>
            </thead>

            <tbody>
              {shareFiles.map(shareFile => (
                <tr key={shareFile.id}>
                  <td>
                    {shareFile.file.name}
                  </td>
                  <td>
                    {shareFile.file.type}
                  </td>
                  <td>
                    {$date(shareFile.created_at).format("YYYY-MM-DD hh:mm A")}
                  </td>
                  <td>
                    {shareFile.user.name}
                  </td>
                  <td>
                    {shareFile.file.user.name}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default withAdminLayout(ShareFilesPage, "Court - Share Files");
