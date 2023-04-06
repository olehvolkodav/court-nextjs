import { classNames } from "@/utils/classname";

export interface IButtonThemeOptions {
  size?: string;
  color?: string;
}

export const buttonSizes = {
  sm: "px-2 py-1.5 text-sm",
  default: "px-3 py-2 text-sm",
  // You can add more buttonSizes here
}

export const buttonColors = {
  primary: "text-white bg-primary-1 hover:bg-indigo-700 border-transparent",
  default: "text-gray-700 border-gray-300",
  danger: "text-white bg-red-600 hover:bg-red-700 border-transparent",
  // add more buttonColors here
}

export function button(options?: IButtonThemeOptions) {
  options = Object.assign<IButtonThemeOptions, IButtonThemeOptions>({
    size: "default",
    color: "primary",
  }, options ?? {});

  const { size, color } = options as any;

  return classNames(
    "inline-flex items-center justify-center",
    "border font-medium rounded-md shadow-sm focus:outline-none focus:ring-0 disabled:opacity-50",
    buttonSizes[size],
    buttonColors[color]
  )
}
