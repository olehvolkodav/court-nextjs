import React, {useEffect} from "react";
import ContentPageForm from "@/components/content-page/ContentPageForm";
import {$gql, $http} from "@/plugins/http";
import {useToast} from "@/hooks/toast.hook";
import {useRouter} from "next/router";
import { NextPageWithLayout } from "@/interfaces/page.type";
import { withAdminLayout } from "@/hoc/layout";

const CONTENT_PAGE_QUERY = `
  query($id: ID!) {
    admin_content_page(id: $id) {
      id
      title
      slug
      description
      content
      order
      status
      navigation_id
      navigation{
          id
          title
      }
    }
  }
`

const EditContentPage: NextPageWithLayout = () => {
  const [contentPage, setContentPage] = React.useState<any>();

  const toast = useToast();
  const router = useRouter();

  useEffect(() => {
    const contentId = router.query.id;

    const getContentPage = async () => {
      try {
        const data = await $gql({
          query: CONTENT_PAGE_QUERY,
          variables: {
            id: contentId
          }
        });

        setContentPage(data?.admin_content_page);
      } catch (error) {
      }
    }

    if (contentId) {
      getContentPage();
    }
  }, [router.query.id]);

  const updateContentPage = async (payload: any) => {
    const id = router.query.id;

    try {
      await $http.patch(`admin/content-pages/${id}`, {
        ...payload,
        id,
        type: "update",
      });

      toast.show({message: "Content Page Updated!"});

      router.replace("/super-admin/content-pages");
    } catch (error) {
    }
  }

  return (
    <>
      {!!contentPage && <ContentPageForm handleSubmit={updateContentPage} contentPage={contentPage} />}
    </>
  );
}


export default withAdminLayout(EditContentPage, "Court - Edit Content Page");