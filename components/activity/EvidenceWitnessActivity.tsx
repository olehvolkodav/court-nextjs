import AvatarIcon from "@/components/icons/AvatarIcon";
import React from "react";

export const EvidenceWitnessActivity: React.FC<{ activity: any }> = ({ activity }) => {
  return (
    <>
      <div>
        <dt className="text-sm font-medium text-gray-500">
          Witnesses
        </dt>
      </div>

      <div className="sm:col-span-2">
        {activity.subject?.witnesses.map((witness: any) => (
          <div className="flex-5 flex items-center" key={`witness-${witness.id}`}>
            <dt className="text-sm font-medium text-gray-500">
              <span className="inline-block h-10 w-10 rounded-full overflow-hidden bg-gray-100">
                <AvatarIcon />
              </span>
            </dt>
            <span className="ml-2.5">
              <span>
                <dd className="mt-1 text-sm text-gray-900">
                  {witness?.name}
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-small bg-gray-100 text-gray-800 ml-2.5 text-[#FFFFFF] bg-[#352F62]">
                    {witness?.organization}
                  </span>
                </dd>
              </span>
              <dd className="mt-1 text-sm text-gray-900">
                {witness?.relation} Witness
              </dd>
            </span>
          </div>
        )
        )}
      </div>
    </>
  )
}
