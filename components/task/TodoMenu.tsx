import React, { Fragment } from "react";
import { ClockIcon, DotsVerticalIcon } from "@heroicons/react/outline";
import { Menu, Transition } from "@headlessui/react";
import { MenuLink } from "@/components/ui/link";
import { classNames } from "@/utils/classname";
import { useStore } from "effector-react";
import { $user } from "@/store/auth.store";
import { useRouter } from "next/router";

interface Props {
  task: any;
  onSnooze?: (task: any) => any;
}
const TodoMenu: React.FC<Props> = ({ task, onSnooze }) => {
  const user = useStore($user);
  const router = useRouter();
  if (user.id != task.user_id) <></>;

  const handleSnoozeClick = () => {
    if (onSnooze) {
      onSnooze(task);
    }
  };

  return (
    <div className="flex space-x-2">
      <button
        type="button"
        className="h-6 w-6 text-natural-13"
        onClick={handleSnoozeClick}
      >
        <ClockIcon />
      </button>

      <Menu as="div" className="relative">
        <Menu.Button className="h-6 w-6 text-gray-700">
          <DotsVerticalIcon />
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
          <Menu.Items className="origin-top-right z-10 absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="py-1">
              <Menu.Item>
                <MenuLink
                  href={{
                    pathname: "/dashboard/[case]/tasks/[id]/edit",
                    query: { id: task.id, case: router.query.case },
                  }}
                  className={classNames(
                    "group flex items-center px-4 py-2 text-sm hover:bg-gray-100 text-natural-13"
                  )}
                >
                  Edit
                </MenuLink>
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
};

export default TodoMenu;
