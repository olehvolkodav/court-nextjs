import { ReactProps } from "@/interfaces/react.props";
import React from "react";

interface Props extends ReactProps, React.LabelHTMLAttributes<HTMLLabelElement> {}

export const Label: React.FC<Props> = ({children, ...rest}) => {
  return (
    <label {...rest}>
      {children}
    </label>
  )
}

Label.defaultProps = {
  className: "block text-sm font-medium text-gray-700 mb-1"
}
