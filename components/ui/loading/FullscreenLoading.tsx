import { ReactProps } from "@/interfaces/react.props";
import React from "react";
import { Loading } from "./Loading";

/** Need to move this later as FullscreenLoading */
export const FullscreenLoading: React.FC<ReactProps> = ({children}) => {
  return (
    <div className="min-h-screen relative">
      <div className="fixed inset-0 flex flex-col justify-center items-center">
        <Loading />

        {children || (
          <p>Please wait preparing your credentials</p>
        )}
      </div>
    </div>
  )
}
