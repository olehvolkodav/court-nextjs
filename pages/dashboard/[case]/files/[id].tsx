import { withDashboardLayout } from "@/hoc/layout";
import React from "react";
import { NextPageWithLayout } from "@/interfaces/page.type";
import { FileExplorer } from "@/components/file/FileExplorer";
import { useRouter } from "next/router";
import { $fileActions } from "@/store/file.store";

const SubFolderPage: NextPageWithLayout = () => {
  const router = useRouter();

  React.useEffect(() => {
    $fileActions.setSlideFile(null);
  }, [router.query.id])

  return (
    <FileExplorer />
  )
}

export default withDashboardLayout(SubFolderPage, "Court - Files");
