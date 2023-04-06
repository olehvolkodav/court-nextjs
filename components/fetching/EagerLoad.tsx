import React from "react";
import { Loading } from "../ui/loading";

type LoadingComponent = JSX.Element | (() => JSX.Element);

interface EagerLoadProps {
  children: React.ReactNode;
  when: boolean;
  loadingComponent?: LoadingComponent;
}

export const EagerLoad: React.FC<EagerLoadProps> = ({
  children,
  when,
  loadingComponent: Component
}) => {
  if (!when) {
    if (!Component) {
      return <Loading />
    }

    return typeof Component === "function" ? <Component /> : Component;
  }

  return (
    <>
      {children}
    </>
  );
}
