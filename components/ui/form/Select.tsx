import { ReactProps } from "@/interfaces/react.props";
import { classNames } from "@/utils/classname";
import React from "react";

interface ISelectProps extends ReactProps, React.SelectHTMLAttributes<HTMLSelectElement> {
  onChangeValue?: (value: any) => any;
  appendClassName?: string;
}

export const Select: React.FC<ISelectProps> = ({children, onChangeValue, appendClassName, ...rest}) => {
  const handleChange: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
    if (rest.onChange) {
      rest.onChange(e);
    }

    if (onChangeValue) {
      onChangeValue(e.target.value)
    }
  }

  return (
    <select
      {...rest}
      onChange={handleChange}
      className={classNames(
        rest.className,
        appendClassName
      )}
    >
      {children}
    </select>
  )
}

Select.defaultProps = {
  className: "shadow-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
}
