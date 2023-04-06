/* This example requires Tailwind CSS v2.0+ */
import React, { Fragment, useRef, useState } from "react"
import { Dialog, Transition } from "@headlessui/react"
import { SearchIcon } from "@heroicons/react/outline"
import { ModalProps } from "@/interfaces/modal.props";
import { debounce } from "@/utils/debounce";
import { useRouter } from "next/router";

interface Props extends ModalProps {

}

const existNavs = ["cases"];

export const GlobalSearch: React.FC<Props> = ({isOpen, onClose}) => {
  const router = useRouter();
  const [search, setSearch] = useState<string>();

  const [results, setResults] = useState<any[]>([]);

  const inputRef = useRef(null);

  const searchResult = debounce(function(e: any) {
    setSearch(e.target.value);

    if (!!e.target.value) {
      fetch("/api/search", {
        method: "post",
        body: JSON.stringify({search: e.target.value}),
      }).then(async res => {
        const data = await res.json();

        setResults(data.results);
      }).catch((err) => {
        console.log(err)
      })
    }
  });

  const navigateToResult = React.useCallback(
    (result: any) => (e) => {
      const replacedIndex = result._index_name.replace("court_", "");

      if (existNavs.includes(replacedIndex)) {
        if (onClose) {
          onClose(false)
        }
        return router.push(`/dashboard/${replacedIndex}/${result.objectID}`)
      }
    }
  , [router, onClose])

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24" initialFocus={inputRef} onClose={onClose as any}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-800 bg-opacity-60 transition-opacity opacity-100" />
        </Transition.Child>

        <div className="relative w-full max-w-lg transform px-4 transition-all opacity-100 scale-100">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <Dialog.Panel className="overflow-hidden rounded-lg bg-white shadow-md">
              <div className="relative flex items-center pr-4 shadow-sm">
                <input
                  type="text"
                  ref={inputRef}
                  className="focus:outline-none border-0 focus:ring-0 border-transparent -mr-9 flex-auto appearance-none bg-transparent py-4 pl-4 pr-12 text-base text-gray-600 placeholder-gray-500 sm:text-sm"
                  placeholder="Search Anything..."
                  onChange={searchResult}
                />

                <SearchIcon className="pointer-events-none flex-none text-gray-400 h-5 w-5" />
              </div>

              {!!search && (
                <ul
                  className="max-h-[18.375rem] divide-y divide-gray-200 overflow-y-auto rounded-b-lg border-t border-gray-200 text-sm font-medium"
                >
                  {results.map(option => (
                    <li
                      className="flex justify-between p-4 hover:bg-gray-50 group cursor-pointer"
                      key={`${option._index_name}_${option.objectID}`}
                      onClick={navigateToResult(option)}
                    >
                      <span className="whitespace-nowrap text-gray-900 group-hover:text-teal-600">
                        {option._title}
                      </span>

                      <span className="ml-4 text-right text-gray-500 capitalize">
                        {option._index_name.replace("_", " ").replace("court ", "")}
                      </span>
                    </li>
                  ))}

                  {!results.length && (
                    <li className="p-4 bg-gray-50 text-center">
                      <p className="font-semibold text-lg mb-2 text-gray-900">No Result Found</p>
                      <p className="text-sm text-gray-700">
                        We cant find anything with that term at the moment, try searching something else.
                      </p>
                    </li>
                  )}
                </ul>
              )}
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

GlobalSearch.defaultProps = {
  isOpen: false,
  onClose: () => {}
}