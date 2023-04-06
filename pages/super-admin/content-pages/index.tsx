import React, {useEffect, useRef} from "react";
import {$gql, $http} from "@/plugins/http";
import Link from "next/link";
import {MenuLink} from "@/components/ui/link";
import {useToast} from "@/hooks/toast.hook";
import {withAdminLayout} from "@/hoc/layout";

const CONTENT_PAGE_QUERY = `
  query($first: Int) {
    admin_content_pages(first: $first, orderBy: [{column: ORDER, order: ASC}]) {
      data {
        id
        title
        slug
        description
        content
        order
        status
        navigation_id
        navigation {
          id
          title
        }
      }
    }
  }
`

const ContentPage = () => {
  const [contentPages, setContentPages] = React.useState<any[]>([]);
  const [refetch, setRefetch] = React.useState<Boolean>(false);
  const dragItem = useRef<any>();
  const dragOverItem = useRef<any>();
  const toast = useToast();

  useEffect(() => {
    const getContentPages = async () => {
      try {
        const data = await $gql({
          query: CONTENT_PAGE_QUERY,
        });

        setContentPages(data?.admin_content_pages?.data);
      } catch (error) {
      }
    }
    getContentPages();
  }, [refetch]);

  const handleDragStart = (position: number | string) => () => {
    dragItem.current = position;
  };

  const handleDragEnter = (position: number | string) => () => {
    dragOverItem.current = position;
  };

  const drop = async () => {
    const editId = dragOverItem.current;

    try {
      await $http.patch(`admin/content-pages/${editId}`, {
        id: editId,
        swap_id: dragItem?.current,
        type: "swap",
      });

      toast.show({message: "Content Page Updated!"});
      setRefetch(!refetch);
    } catch (error) {
    }
  };

  return (
    <div className="py-4">
      <div className="container px-4 mx-auto">
        <div className="sm:flex sm:items-center mb-4">
          <div className="sm:flex-auto">
            <h1 className="text-xl font-semibold text-gray-900">Content Pages</h1>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <Link href="/super-admin/content-pages/create">
              <a
                className="text-white bg-indigo-600 hover:bg-indigo-700 px-3 py-2 text-sm border border-transparent font-medium rounded-md shadow-sm">
                Add Content Page
              </a>
            </Link>
          </div>
        </div>

        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <table className="x-table">
            <thead className="bg-gray-50">
              <tr>
                <th>
                  Page Title
                </th>
                <th>
                  Page Description
                </th>
                <th>
                  Page Location
                </th>
                <th>
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200 bg-white">
              {contentPages.map(contentPage => (
                <tr key={contentPage.id}
                  onDragStart={handleDragStart(contentPage.id)}
                  onDragEnter={handleDragEnter(contentPage.id)}
                  onDragEnd={drop}
                  draggable
                >
                  <td>
                    {contentPage.title}
                  </td>
                  <td>
                    {contentPage.description}
                  </td>
                  <td>
                    {contentPage?.navigation?.title}
                  </td>
                  <td>
                    <div>
                      <MenuLink
                        className="flex flex-1 justify-center font-medium text-gray-700"
                        href={{
                          pathname: "/super-admin/content-pages/[id]/edit",
                          query: {id: contentPage.id}
                        }}
                      >
                        Edit
                      </MenuLink>
                    </div>
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

export default withAdminLayout(ContentPage);
