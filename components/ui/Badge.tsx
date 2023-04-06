import { ReactProps } from "@/interfaces/react.props";
import { classNames } from "@/utils/classname";
import React from "react";

interface IBadgeProps
  extends ReactProps,
    React.HTMLAttributes<HTMLSpanElement> {
  color?: string;
  size?: string;
}

const colors = {
  default: "bg-gray-100 text-gray-800",
  orange: "bg-orange-400 text-white",
  primary: "bg-natural-13 text-white",
  blue: "blue-badge",
  green: "green-badge",
  red: "red-badge",
};

const sizes = {
  xs: "px-2 py-0.5 text-xs",
  sm: "px-2 py-1 text-xs",
  default: "px-2.5 py-1.5 text-sm",
};

export const Badge: React.FC<IBadgeProps> = ({
  children,
  className,
  color,
  size,
  ...rest
}) => {
  const colorClass = React.useMemo(() => {
    return colors[color as string] || color;
  }, [color]);

  const sizeClass = React.useMemo(() => {
    return sizes[size as string] || size;
  }, [size]);

  return (
    <span
      {...rest}
      className={classNames(
        "inline-flex items-center rounded-lg font-medium",
        colorClass,
        className,
        sizeClass
      )}
    >
      {children}
    </span>
  );
};

Badge.defaultProps = {
  color: "default",
  size: "default",
};
