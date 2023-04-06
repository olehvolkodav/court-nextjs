import React, { useEffect, useReducer, useState } from "react"
import Link from "next/link"
import { withAdminLayout } from "@/hoc/layout";
import { $gql } from "@/plugins/http";
import { $date } from "@/plugins/date";
import { PAGINATION_FIELD, parsePage } from "@/graphql/query/util";
import { paginationInitialState, paginationReducer } from "@/reducers/pagination.reducer";
import { Pagination } from "@/components/ui/pagination/Pagination";
import { useRouter } from "next/router";
import { $theme } from "@/theme";

const TEMPLATES_QUERY = `
  query($page: Int, $first: Int) {
    templates: admin_templates(page: $page, first: $first) {
      data {
        id
        name
        body
        description
        created_at
      }
      ${PAGINATION_FIELD}
    }
  }
`

const TemplatePage: React.FC = () => {
  const router = useRouter();

  const [templates, setTemplates] = useState<any[]>([]);
  const [pagination, dispatch] = useReducer(paginationReducer, paginationInitialState);

  useEffect(() => {
    const page = parsePage(router.query.page);

    const getTemplates = async() => {
      try {
        const data = await $gql({
          query: TEMPLATES_QUERY,
          variables: { page }
        });

        setTemplates(data.templates.data)
        dispatch({type: "set", value: data.templates.paginatorInfo})
      } catch (error) {

      }
    }

    getTemplates();
  }, [router.query.page])

  return (
    <div className="py-4">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-semibold text-gray-900">Templates</h1>

          <div>
            <Link href="/super-admin/templates/create">
              <a className={$theme.button()}>
                Create Template
              </a>
            </Link>
          </div>
        </div>

        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <table className="x-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Created</th>
                <th>
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {templates.map((template) => (
                <tr key={template.id}>
                  <td>
                    {template.name}
                  </td>
                  <td>
                    {$date(template.created_at).format("YYYY-MM-DD hh:mm A")}
                  </td>
                  <td>
                    <Link href={`/super-admin/templates/${template.id}/edit`}>
                      <a className="text-primary-1 font-medium">Edit</a>
                    </Link>
                  </td>
                </tr>
              ))}

              {!templates.length && (
                <tr>
                  <td colSpan={5} className="text-center">
                    No Templates
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="px-4 py-2 bg-gray-50 border-t">
            <Pagination data={pagination} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default withAdminLayout(TemplatePage, "Court - Templates");
