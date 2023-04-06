import React from "react";
import { XIcon } from "@heroicons/react/outline";

interface Props {
  onChange?: (tags: string[]) => any;
  maxTag?: number;
  placeholder?: string;
  value?: any[];
}

export const TagInput: React.FC<Props> = ({onChange, maxTag, placeholder, value: defaultValue}) => {
  const [tags, setTags] = React.useState<string[]>(defaultValue ?? []);
  const inputRef = React.useRef<HTMLInputElement>();
  const [value, setValue] = React.useState<string>();

  const removeTag = (tag: any) => () => {
    setTags(prev => prev.filter(o => o !== tag))
  }

  const addTag: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.code === "Enter" && !!value && inputRef.current) {
      e.preventDefault();
      e.stopPropagation();
      if (tags.find(tag => tag.toLowerCase() == value.toLowerCase())) {
        inputRef.current.value = "";
        return setValue("");
      }

      setTags(prev => [...prev, value as string])

      setValue("");
      inputRef.current.value = "";
    }
  }

  const onChangeTag: React.ChangeEventHandler<HTMLInputElement> = (e) => setValue(e.target.value);

  const shouldHideInput = React.useMemo(() => {
    if (!maxTag) {
      return false;
    }

    return tags.length >= maxTag;
  }, [maxTag, tags])

  React.useEffect(() => {
    if (onChange) {
      onChange(tags);
    }
  }, [tags, onChange]);

  return (
    <div className="border border-gray-300 rounded-md px-3 py-2 shadow-sm focus-within:ring-1 focus-within:ring-indigo-600 focus-within:border-indigo-600">
      {!!tags.length && (
        <div className="pr-3 space-x-2 mb-1">
          {tags.map(tag => (
            <button
              key={tag}
              type="button"
              className="inline-flex items-center py-1 pr-1 pl-2 font-medium bg-gray-100 text-gray-800 text-xs rounded relative"
              onClick={removeTag(tag)}
            >
              <span className="pr-1">{tag}</span>
              <XIcon className="h-4 w-4" />
            </button>
          ))}
        </div>
      )}

      {!shouldHideInput && (
        <input
          ref={inputRef as any}
          onKeyDown={addTag}
          onChange={onChangeTag}
          type="text"
          className="sm:text-sm w-full px-0 py-0 block border-0 text-gray-900 placeholder-gray-500 focus:ring-0 sm:text-sm"
          placeholder={placeholder}
        />
      )}
    </div>
  )
}

TagInput.defaultProps = {
  placeholder: "Add Tag"
}
