import React from "react";

export interface ReactProps {
  children?: React.ReactNode;
}

export interface ErrorProps {
  pageError: boolean;
  statusCode: number;
}