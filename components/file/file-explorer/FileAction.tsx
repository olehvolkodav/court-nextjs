import { classNames } from "@/utils/classname"
import { Menu, Transition } from "@headlessui/react"
import { ArchiveIcon, ArrowCircleRightIcon, DotsVerticalIcon } from "@heroicons/react/outline"
import { Fragment } from "react"

interface Props {
  file: any;
  onMoveClick?: () => any;
}

export const FileAction: React.FC<Props> = ({file, onMoveClick}) => {
  return (
    <Menu as="div" className="relative inline-block text-left h-6 w-6">
      <Menu.Button className="inline-flex justify-center">
        <DotsVerticalIcon className="h-6 w-6" aria-hidden="true" />
      </Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="origin-top-right absolute z-10 right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 focus:outline-none">
          {/* <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <a
                  href="#"
                  className={classNames(
                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                    'group flex items-center px-4 py-2 text-sm'
                  )}
                >
                  <PencilAltIcon className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" aria-hidden="true" />
                  Details
                </a>
              )}
            </Menu.Item>
          </div> */}
          <div className="py-1">
            {/* <Menu.Item>
              {({ active }) => (
                <a
                  href="#"
                  className={classNames(
                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                    'group flex items-center px-4 py-2 text-sm'
                  )}
                >
                  <ArchiveIcon className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" aria-hidden="true" />
                  Archive
                </a>
              )}
            </Menu.Item> */}
            <Menu.Item>
              {({ active }) => (
                <button
                  type="button"
                  className={classNames(
                    active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                    "group flex items-center px-4 py-2 text-sm w-full text-left"
                  )}
                  onClick={onMoveClick}
                >
                  <ArrowCircleRightIcon
                    className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                    aria-hidden="true"
                  />
                  Move To
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}
