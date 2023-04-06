import React, { useState } from "react";
import { CheckIcon } from "@heroicons/react/solid";
import { classNames } from "@/utils/classname";
import { ChevronDownIcon, XIcon } from "@heroicons/react/outline";

interface Props {
  value?: any[];
  placeholder?: string;
  onInput?: (value: string) => any;
  options?: any[];

  /**
   * Show loading on combobox options, useful for showing options through api/graphql
   */
  isLoading?: boolean;

  keyBy: string;
  labelBy: string;
  onValueChange?: (value: any) => any;
  closeOnSelect?: boolean;
}

export const MultiSelect: React.FC<Props> = ({
  placeholder,
  onInput,
  isLoading,
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

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) =>
    onInput && onInput(e.target.value);

  const isSelected = React.useCallback(
    (item: any) => {
      return !!values.find((v) => v[keyBy] == item[keyBy]);
    },
    [values, keyBy]
  );

  const onSelectChange = (item: any) => (e: any) => {
    setValues((prev) => {
      if (prev.find((v) => v[keyBy] == item[keyBy])) {
        const filters = prev.filter((v) => v[keyBy] != item[keyBy]);

        if (onValueChange) {
          onValueChange(filters);
        }

        return filters;
      }

      const filters = [...prev, item];

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

  const removeItem = (item: any) => (e: any) => {
    setValues((prev) => {
      const filters = prev.filter((v) => v[keyBy] != item[keyBy]);

      if (onValueChange) {
        onValueChange(filters);
      }

      return filters;
    });
  };

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
        <div className="relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-2 pr-10 text-left transition duration-150 ease-in-out focus-within:border-blue-700 focus-within:outline-none focus-within:ring-1 focus-within:ring-blue-700 sm:text-sm sm:leading-5">
          <div className="flex flex-wrap gap-2">
            {values.map((item) => (
              <span
                key={`selected-item-${item[keyBy]}`}
                className="flex items-center gap-1 rounded bg-blue-50 px-2 py-0.5 capitalize"
              >
                <span>{item[labelBy]}</span>
                <XIcon
                  onClick={removeItem(item)}
                  className="h-4 w-4 cursor-pointer"
                />
              </span>
            ))}

            <input
              ref={inputRef as any}
              type="text"
              className="sm:text-sm flex-1 border-0 px-0 py-0 text-gray-900 placeholder-gray-500 focus:ring-0 sm:text-sm"
              placeholder={placeholder}
              onChange={handleChange}
            />
          </div>

          <button
            onClick={toggleIsOpen}
            type="button"
            className="absolute inset-y-0 right-0 flex items-center pr-2 text-gray-500"
          >
            <ChevronDownIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      {isOpen && (
        <ul className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
          {options?.map((item) => (
            <li
              key={item[keyBy]}
              tabIndex={isOpen && -1}
              className={classNames(
                "relative cursor-pointer select-none py-2 pl-8 pr-4 group capitalize",
                "hover:bg-indigo-600 hover:text-white text-gray-900"
              )}
              onClick={onSelectChange(item)}
            >
              <span
                className={classNames(
                  "block truncate",
                  isSelected(item) && "font-semibold"
                )}
              >
                {item[labelBy]}
              </span>

              {isSelected(item) && (
                <span
                  className={classNames(
                    "absolute inset-y-0 left-0 flex items-center pl-1.5 text-indigo-600 group-hover:text-white"
                  )}
                >
                  <CheckIcon className="h-5 w-5" aria-hidden="true" />
                </span>
              )}
            </li>
          ))}
          {!options?.length && (
            <li className="text-center">
              <span>No Data</span>
            </li>
          )}
        </ul>
      )}
    </div>
  );
};

MultiSelect.defaultProps = {
  placeholder: "Select...",
  options: [],
  closeOnSelect: false,
};
