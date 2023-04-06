import { Fragment } from "react"
import { Listbox, Transition } from "@headlessui/react"
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/solid"
import { classNames } from "@/utils/classname"

interface Props {
  value?: string;
  onChangeValue?: (value: string) => void;
}

const publishingOptions = ["open", "closed", "all"]

export const TaskFilter: React.FC<Props> = ({value, onChangeValue}) => {
  const handleChange = (value: string) => {
    onChangeValue && onChangeValue(value)
  }

  return (
    <Listbox value={value} onChange={handleChange}>
      {({ open }) => (
        <>
          <Listbox.Label className="sr-only">Change status</Listbox.Label>
          <div className="relative">
            <div className="inline-flex shadow-sm rounded-md divide-x">
              <div className="relative z-0 inline-flex shadow-sm rounded-md divide-x">
                <div className="relative inline-flex items-center bg-white py-2 pl-3 pr-4 border border-transparent rounded-l-md shadow-sm text-gray-700">
                  <p className="text-sm font-medium capitalize">Status: {value}</p>
                </div>
                <Listbox.Button className="relative inline-flex items-center bg-white p-2 rounded-l-none rounded-r-md text-sm font-medium text-gray-700 focus:outline-none focus:z-10">
                  <span className="sr-only">Change status</span>
                  <ChevronDownIcon className="h-5 w-5 text-gray-700" aria-hidden="true" />
                </Listbox.Button>
              </div>
            </div>

            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="origin-top-right absolute z-10 right-0 mt-2 w-72 rounded-md shadow-lg overflow-hidden bg-white divide-y divide-gray-200 ring-1 ring-black ring-opacity-5 focus:outline-none">
                {publishingOptions.map((option) => (
                  <Listbox.Option
                    key={option}
                    className={({ active }) =>
                      classNames(
                        active ? "text-gray-700 bg-white" : "text-gray-900",
                        "cursor-pointer relative p-4 text-sm capitalize"
                      )
                    }
                    value={option}
                  >
                    {({ selected, active }) => (
                      <div className="flex flex-col">
                        <div className="flex justify-between">
                          <p className={selected ? "font-semibold" : "font-normal"}>{option}</p>
                          {selected ? (
                            <span className={active ? "text-gray-700" : "text-indigo-500"}>
                              <CheckIcon className="h-5 w-5" aria-hidden="true" />
                            </span>
                          ) : null}
                        </div>
                      </div>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </>
      )}
    </Listbox>
  )
}
