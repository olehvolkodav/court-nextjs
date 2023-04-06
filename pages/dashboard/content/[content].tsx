import { withDashboardLayout } from "@/hoc/layout";
import { NextPageWithLayout } from "@/interfaces/page.type";
import { $gql } from "@/plugins/http";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export const CONTENT_PAGE_QUERY = `
  query($slug: String!) {
    content_page(slug: $slug) {
      id
      title
      content
      slug
    }
  }
`

const ContentDetailPage: NextPageWithLayout = () => {
  const router = useRouter();

  const [contentPage, setContentPage] = useState<any>();

  useEffect(() => {
    const getContentPage = async() => {
      try {
        const data = await $gql({
          query: CONTENT_PAGE_QUERY,
          variables: {
            slug: router.query.content as string
          }
        });

        setContentPage(data.content_page);
      } catch (error) {

      }
    }

    getContentPage()
  }, [router.query.content])

  return (
    <>
      <div className="py-4">
        <div className="container px-4 mx-auto">
          {!!contentPage && (
            <div>
              <h1 className="text-2xl font-bold text-natural-13 mb-4">{contentPage.title}</h1>

              <div className="prose" dangerouslySetInnerHTML={{__html: contentPage.content}} />
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default withDashboardLayout(ContentDetailPage, "Court - Content");
