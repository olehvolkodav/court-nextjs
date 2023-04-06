import React from "react";
import { PlusIcon } from "@heroicons/react/solid"
import { useStore } from "effector-react";
import { $user, $userLoaded } from "@/store/auth.store";
import { ShieldExclamationIcon } from "@heroicons/react/outline";
import Link from "next/link";

interface Props {
  children: React.ReactNode;
  message?: string;
}

// not sure with the name of this component
export const CasePermission: React.FC<Props> = ({children, message}) => {
  const user = useStore($user);

  return (
    <>
      {user?.hasCasePermission ? children : (
        <div className="text-center">
          <ShieldExclamationIcon className="mx-auto h-12 w-12 text-gray-400" />

          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No Permission
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {message}
          </p>
          <div className="mt-6">
            <Link
              href="/dashboard/profile/billing"
            >
              <a className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />

                Buy Case Product
              </a>
            </Link>
          </div>
        </div>
      )}
    </>
  )
}

CasePermission.defaultProps = {
  message: "you havent bought the product to make a case"
}
