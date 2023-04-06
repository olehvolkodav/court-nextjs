import React from "react";
import ContentPageForm from "@/components/content-page/ContentPageForm";
import {$http} from "@/plugins/http";
import {useToast} from "@/hooks/toast.hook";
import {useRouter} from "next/router";
import { NextPageWithLayout } from "@/interfaces/page.type";
import { withAdminLayout } from "@/hoc/layout";

const CreateContentPage: NextPageWithLayout = () => {
  const toast = useToast();
  const router = useRouter();

  const saveContentPage = async (payload: any) => {
    try {
      await $http.post("admin/content-pages", payload);

      toast.show({message: "Content Page Created!"});

      router.replace("/super-admin/content-pages");
    } catch (error) {
    }
  }

  return (
    <>
      <ContentPageForm handleSubmit={saveContentPage}/>
    </>
  );
}

export default withAdminLayout(CreateContentPage, "Court - Create Content Page");