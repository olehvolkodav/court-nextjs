import React, { useState } from "react";
import { classNames } from "@/utils/classname";
import { ChevronDownIcon } from "@heroicons/react/outline";

interface Props {
  className?: string;
  value?: any[];
  label?: string;
  isSingleChoice?: boolean;
  options?: any[];
  keyBy: string;
  labelBy: string;
  onValueChange?: (value: any) => any;
  closeOnSelect?: boolean;
}

export const MultiSelectType: React.FC<Props> = ({
  className,
  label,
  isSingleChoice,
  options,
  keyBy,
  labelBy,
  onValueChange,
  value,
  closeOnSelect,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const inputRef = React.useRef<HTMLInputElement>();
  const rootRef = React.useRef<HTMLDivElement>();

  const [values, setValues] = useState<any[]>(value || []);

  const isSelected = React.useCallback(
    (item: any) => {
      return !!values.find((v) => v[keyBy] == item[keyBy]);
    },
    [values, keyBy]
  );

  const onSelectChange = (item: any) => (e: any) => {
    setValues((prev) => {
      const selectedItem = prev.find((v) => v[keyBy] == item[keyBy]);
      if (selectedItem) {
        const filters = isSingleChoice
          ? [selectedItem]
          : prev.filter((v) => v[keyBy] != item[keyBy]);

        if (onValueChange) {
          onValueChange(filters);
        }

        return filters;
      }

      const filters = isSingleChoice
        ? [item]
        : [...prev, item];

      if (onValueChange) {
        onValueChange(filters);
      }

      return filters;
    });

    if (inputRef.current) {
      inputRef.current.value = "";
    }

    if (closeOnSelect) {
      setIsOpen(false);
    }
  };

  const toggleIsOpen: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    inputRef.current?.focus();
  };

  const onBlur = React.useCallback((e: FocusEvent) => {
    if (!rootRef.current?.contains(e.relatedTarget as any)) {
      setIsOpen(false);
    }
  }, []);

  const onFocus = React.useCallback((e: FocusEvent) => {
    setIsOpen(true);
  }, []);

  React.useEffect(() => {
    const root = rootRef.current;

    root?.addEventListener("focusout", onBlur);
    root?.addEventListener("focusin", onFocus);

    return () => {
      root?.removeEventListener("focusout", onBlur);
      root?.removeEventListener("focusin", onFocus);
    };
  }, [rootRef, onBlur, onFocus]);

  React.useEffect(() => {
    if (value !== undefined) {
      setValues(value);
    }
  }, [value]);

  return (
    <div className="relative" ref={rootRef as any}>
      <div className="inline-block w-full rounded-md shadow-sm">
        <div className="w-full cursor-default rounded-md border border-gray-300 bg-white py-2 px-2 text-left transition duration-150 ease-in-out focus-within:border-blue-700 focus-within:outline-none focus-within:ring-1 focus-within:ring-blue-700 sm:text-sm sm:leading-5">
          <button
            onClick={toggleIsOpen}
            type="button"
            className="flex items-center text-natural-13"
          >
            {label}
            <ChevronDownIcon className="h-5 w-5 ml-2" />
          </button>
        </div>
      </div>

      {isOpen && (
        <ul className={
          classNames(
            "absolute z-10 mt-3 flex items-center flex-wrap overflow-auto rounded-2xl bg-white p-8 text-base shadow-select ring-opacity-5 focus:outline-none sm:text-sm",
            className
          )}>
          {options?.map((item, idx: number) => (
            <li
              key={idx}
              className={classNames(
                "relative flex items-center select-none py-2 pl-8 pr-4 capitalize w-1/2 my-2"
              )}
              onClick={onSelectChange(item)}
            >
              <div
                style={{ border: `2px solid ${item.color}` }}
                className="mr-2.5 bg-white border-2 rounded-sm border-gray-400 w-5 h-5 flex flex-shrink-0 justify-center items-center relative">
                <input id={`Type${keyBy}${idx}`} defaultChecked={isSelected(item)} name="ExtensionGroup" type={isSingleChoice ? "radio" : "checkbox"} className="checkbox opacity-0 absolute cursor-pointer w-full h-full" />
                <div
                  style={{ background: item.color }}
                  className="check-icon hidden bg-[#6200ee] text-white rounded-sm">
                  {isSingleChoice ?
                    <div className="w-3 h-3 rounded bg-[#6200ee] m-auto" />
                    :
                    <svg className="icon icon-tabler icon-tabler-check" xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                      <path stroke="none" d="M0 0h24v24H0z" />
                      <path d="M5 12l5 5l10 -10" />
                    </svg>
                  }
                </div>
              </div>
              <label htmlFor={`Type${keyBy}${idx}`}>{item[labelBy]}</label>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

MultiSelectType.defaultProps = {
  className: "",
  label: "Select...",
  options: [],
  closeOnSelect: false,
  isSingleChoice: false
};
