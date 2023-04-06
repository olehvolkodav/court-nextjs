import { withDashboardLayout } from "@/hoc/layout";
import React from "react";
import { NextPageWithLayout } from "@/interfaces/page.type";
import { FileExplorer } from "@/components/file/FileExplorer";
import { $fileActions } from "@/store/file.store";

const FilesPage: NextPageWithLayout = () => {
  React.useEffect(() => {
    return () => {
      $fileActions.setSlideFile(null);
    }
  }, [])

  return (
    <FileExplorer isIndex/>
  )
}

export default withDashboardLayout(FilesPage, "Court - Files");
