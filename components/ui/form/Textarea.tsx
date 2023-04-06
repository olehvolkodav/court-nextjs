import React from "react";

interface ITextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  onChangeText?: (value: any) => any
}

export const Textarea: React.FC<ITextareaProps> = ({onChangeText, ...props}) => {
  const handleChange: React.ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    if (props.onChange) {
      props.onChange(e);
    }

    if (onChangeText) {
      onChangeText(e.target.value)
    }
  }

  return (
    <textarea {...props} onChange={handleChange} />
  )
}

Textarea.defaultProps = {
  className: "shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md",
  rows: 3
}
