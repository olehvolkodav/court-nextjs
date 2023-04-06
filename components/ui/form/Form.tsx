import { ReactProps } from "@/interfaces/react.props";
import React from "react";

interface Props extends ReactProps, React.FormHTMLAttributes<HTMLFormElement> {
  onSubmitPrevent?: React.FormEventHandler<HTMLFormElement>
}

export const Form: React.FC<Props> = ({children, onSubmitPrevent, onSubmit, ...rest}) => {
  const customOnSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (!!onSubmit && !!onSubmitPrevent) {
      return onSubmitPrevent(e)
    }

    if (!!onSubmitPrevent) {
      return onSubmitPrevent(e);
    }

    if (!!onSubmit) {
      return onSubmit(e);
    }
  }

  return (
    <form {...rest} onSubmit={customOnSubmit}>
      {children}
    </form>
  )
}
