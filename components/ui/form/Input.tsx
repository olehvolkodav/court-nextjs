import React, { InputHTMLAttributes } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement>{
  onChangeText?: (value: any) => any;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({onChangeText, ...rest}, ref) => {
    const onInputChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
      if (rest.onChange) {
        rest.onChange(e);
      }

      if (onChangeText) {
        onChangeText(e.target.value)
      }
    }

    return (
      <input
        {...rest}
        ref={ref}
        onChange={onInputChange}
      />
    );
  }
);

Input.displayName = "Input"

Input.defaultProps = {
  type: "text",
  className: "shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md read-only:bg-gray-50"
}
