import React from "react";
import { useRouter } from "next/router";
import { DocumentTextIcon, PencilIcon } from "@heroicons/react/outline";

import { Badge } from "../ui/Badge";

import { $date } from "@/plugins/date";
import { $fileActions } from "@/store/file.store";

export const WitnessList: React.FC<{ witness: any }> = ({ witness }) => {
  const router = useRouter();

  const setFile = (file: any) => () => $fileActions.setSlideFile(file);

  const toWitnessEdit = () => {
    router.push(`/dashboard/${router.query.case}/witnesses/${witness.id}/edit`);
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg" id={`witness-${witness.id}`}>
      <div className="px-4 py-3 lg:px-6 flex justify-between items-center">
        <div>
          <div className="flex items-center">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              {witness.name}
            </h3>

            {witness.label && (
              <span className="text-white rounded-full px-2 py-1 text-xs ml-2 bg-orange-500">
                {witness.label}
              </span>
            )}
          </div>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            {witness.email}
          </p>
        </div>

        <button
          type="button"
          onClick={toWitnessEdit}
        >
          <PencilIcon className="h-6 w-6 pointer-events-none" />
        </button>
      </div>
      <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
        <dl className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Phone Number</dt>
            <dd className="mt-1 text-sm text-gray-900">{witness.phone}</dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Status</dt>
            <dd className="mt-1 capitalize">
              <Badge>{witness.status}</Badge>
            </dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-sm font-medium text-gray-500">Main Points</dt>
            <dd
              className="mt-1 text-sm text-gray-900"
              dangerouslySetInnerHTML={{ __html: witness.main_points }}
            />
          </div>

          {!!witness.files?.length && (
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">
                Physical Evidence
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                <nav
                  role="list"
                  className="space-y-2 flex flex-col overflow-hidden"
                >
                  {witness.files.map((file: any) => (
                    <button
                      type="button"
                      onClick={setFile(file)}
                      className="border border-natural-3 rounded-md relative inline-flex pl-3 pr-4 py-3 flex items-center justify-between text-left text-sm bg-natural-3"
                      key={file.id}
                    >
                      <DocumentTextIcon className="h-6 w-6 text-natural-13" />

                      <div className="flex-1 ml-2">
                        <span className="block truncate text-natural-13">
                          {file.name}
                        </span>
                        <span className="text-gray-600">
                          Added{" "}
                          {$date(file.created_at).format("DD MMM hh:mm A")}
                        </span>
                      </div>
                    </button>
                  ))}
                </nav>
              </dd>
            </div>
          )}
        </dl>
      </div>
    </div>
  );
};
