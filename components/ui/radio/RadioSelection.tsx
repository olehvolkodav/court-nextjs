import React from "react";
import { RadioGroup } from "@headlessui/react";
import { classNames } from "@/utils/classname";

export interface RadioOptions {
  name: string;
  value: any;
}

interface Props {
  options: RadioOptions[];
  value?: any;
  onChange?: (value: any) => any;
  label?: string;

  /**
   * Allow value to be undefined,
   * when clicking/changing to the same value
   */
  allowUndefined?: boolean;
}

export const RadioSelection: React.FC<Props> = ({ options, value, onChange, label, allowUndefined }) => {
  const handleChange = (value: any) => {
    if (onChange) {
      onChange(value);
    }
  }

  const handleClick = (optionValue: any) => (e: any) => {
    if (allowUndefined && (optionValue == value) && onChange) {
      onChange(undefined)
    }
  }

  return (
    <RadioGroup value={value} onChange={handleChange} className="mt-2">
      {!!label && (
        <RadioGroup.Label className="sr-only">{label}</RadioGroup.Label>
      )}

      <div className="flex space-x-4">
        {options.map((option) => (
          <RadioGroup.Option
            key={option.name}
            value={option.value}
            onClick={handleClick(option.value)}
            className={({ active, checked }) =>
              classNames(
                active ? "ring-2 ring-offset-2 ring-indigo-500" : "",
                checked
                  ? "text-primary-1 border-primary-1"
                  : "bg-white border-gray-200 text-gray-900 hover:bg-gray-50",
                "cursor-pointer border py-2 px-3 flex items-center rounded-md justify-center text-sm font-medium uppercase"
              )
            }
          >
            <RadioGroup.Label as="span">{option.name.replace("_", " ")}</RadioGroup.Label>
          </RadioGroup.Option>
        ))}
      </div>
    </RadioGroup>
  )
}

RadioSelection.defaultProps = {
  onChange: (value) => { },
  allowUndefined: false,
}
