import React, { ButtonHTMLAttributes } from "react";
import { ReactProps } from "@/interfaces/react.props";
import { classNames } from "@/utils/classname";
import { buttonColors, buttonSizes, IButtonThemeOptions } from "@/theme/button";

interface Props extends ReactProps, ButtonHTMLAttributes<HTMLButtonElement>, IButtonThemeOptions {
  isLoading?: boolean;
}

export const Button: React.FC<Props> = ({children, size, color, className, isLoading, ...rest}) => {
  const sizeClass = React.useMemo(() => {
    return buttonSizes[size as string] || size;
  }, [size]);

  const colorClass = React.useMemo(() => {
    return buttonColors[color as string] || color;
  }, [color])

  return (
    <button
      disabled={isLoading}
      {...rest}
      className={
        classNames(
          "inline-flex items-center justify-center",
          "border font-medium rounded-md shadow-sm focus:outline-none focus:ring-0 disabled:opacity-50",
          sizeClass,
          colorClass,
          className
        )
      }
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}

      {children}
    </button>
  )
}

Button.defaultProps = {
  type: "button",
  size: "default",
  color: "primary"
}
