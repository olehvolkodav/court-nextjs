import React from "react";
import { Loading } from "../ui/loading/Loading";

/** Need to move this later as FullscreenLoading */
export const DashboardLoading: React.FC = () => {
  return (
    <div className="min-h-screen relative">
      <div className="fixed inset-0 flex flex-col justify-center items-center">
        <Loading />

        <p>Please wait preparing your credentials</p>
      </div>
    </div>
  )
}