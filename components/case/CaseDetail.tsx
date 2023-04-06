import { CASE_ROLE } from "@/constants/role"
import { useDownload } from "@/hooks/download.hook"
import { $date } from "@/plugins/date"
import { $http } from "@/plugins/http"
import { $user } from "@/store/auth.store"
import { classNames } from "@/utils/classname"
import { Menu, Transition } from "@headlessui/react"
import { DotsVerticalIcon } from "@heroicons/react/outline"
import { useStore } from "effector-react"
import Router from "next/router"
import { Fragment, useMemo } from "react"
import { CaseParty } from "./CaseParty"

export const CaseDetail: React.FC<{ courtCase: any }> = ({ courtCase }) => {
  const user = useStore($user);
  const { windowDownload } = useDownload();

  const myUser = useMemo(() => {
    return courtCase?.users.find((courtUser: any) => courtUser.id == user?.id)
  }, [courtCase, user?.id]);

  const hasPermission = useMemo(() => {
    if (courtCase?.status !== "in_progress") {
      return false;
    }

    return myUser?.party.role === CASE_ROLE.OWNER;
  }, [myUser?.party.role, courtCase?.status]);

  const editCase = () => Router.push(`/dashboard/${courtCase.id}/cases/edit`);

  const downloadCase = async () => {
    try {
      const res = await $http.post(`/cases/${courtCase.id}/download`, {}, {
        responseType: "blob"
      });

      windowDownload(res.data, `${courtCase.name}.zip`)
    } catch (error) {

    }
  }

  return (
    <div className="space-y-4">
      <div className="bg-white shadow-sm rounded-md p-4 lg:p-6 relative flex justify-between">
        <div className="grid grid-cols lg:grid-cols-6 gap-4">
          <div>
            <span className="block text-natural-9 text-sm">
              Case Name
            </span>

            <span className="text-natural-13">
              {courtCase.name}
            </span>
          </div>

          <div>
            <span className="block text-natural-9 text-sm">
              Case Number - {courtCase.case_number}
            </span>

            <span className="text-natural-13">
              {$date(courtCase.date).format("MMMM DD, YYYY")}
            </span>
          </div>

          <div>
            <span className="block text-natural-9 text-sm">
              Date Filed
            </span>

            <span className="text-natural-13">
              {$date(courtCase.date).format("MMM DD, YYYY")}
            </span>
          </div>

          <div>
            <span className="block text-natural-9 text-sm">
              Judge Name
            </span>

            <span className="text-natural-13">{courtCase.judge_name}</span>
          </div>

          <div className="lg:col-span-2">
            <span className="block text-natural-9 text-sm">
              Court Address
            </span>

            <span className="text-natural-13">
              {courtCase.address}, {courtCase.city} {courtCase.state} {courtCase.zip} {courtCase.country}
            </span>
          </div>
        </div>

        <div>
          <Menu as="div" className="relative inline-block text-left">
            <Menu.Button type="button">
              <DotsVerticalIcon className="h-6 w-6 text-gray-700" />
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
              <Menu.Items className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="py-1">
                  {hasPermission && (
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          type="button"
                          onClick={editCase}
                          className={classNames(
                            active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                            "block px-4 py-2 inline-flex w-full text-sm text-left"
                          )}
                        >
                          Edit Case
                        </button>
                      )}
                    </Menu.Item>
                  )}
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        type="button"
                        onClick={downloadCase}
                        className={classNames(
                          active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                          "block px-4 py-2 inline-flex w-full text-sm text-left"
                        )}
                      >
                        Download Documents
                      </button>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>

      <CaseParty courtCase={courtCase} />
    </div>
  )
}
