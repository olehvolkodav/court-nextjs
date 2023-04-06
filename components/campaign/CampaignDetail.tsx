import React, { useMemo } from "react";

import { CursorClickIcon, LightningBoltIcon, MailOpenIcon, UsersIcon } from "@heroicons/react/outline";
import { useRouter } from "next/router";
import { useCampaignSWR } from "@/swr/campaign.swr";

export const CampaignDetail: React.FC = () => {
  const router = useRouter();

  const [campaign] = useCampaignSWR(router.query.id as string)

  const stats = useMemo(() => {
    const data: any[] = [];

    if (campaign?.purpose === "instant") {
      data.push({
        name: "Total Recipients",
        stat: 12,
        icon: UsersIcon
      })
    } else {
      data.push(...[
        {
          name: "Total Triggers",
          stat: campaign?.triggers_count,
          icon: LightningBoltIcon,
        },
        {
          name: "Total Sequences",
          stat: campaign?.sequences_count,
          icon: CursorClickIcon,
        }
      ])
    }

    return data;
  }, [campaign])

  return (
    <div>
      <div>
        <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((item, i) => (
            <div
              key={i}
              className="relative bg-white pt-5 px-4 pb-12 sm:pt-6 sm:px-6 shadow rounded-lg overflow-hidden"
            >
              <dt>
                <div className="absolute bg-indigo-500 rounded-md p-3">
                  <item.icon className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                <p className="ml-16 text-sm font-medium text-gray-500 truncate">{item.name}</p>
              </dt>
              <dd className="ml-16 flex items-baseline">
                <p className="text-2xl font-semibold text-gray-900">{item.stat}</p>
                {/* <div className="absolute bottom-0 inset-x-0 bg-gray-50 px-4 py-4 sm:px-6">
                  <div className="text-sm">
                    <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                      {' '}
                      View all<span className="sr-only"> {item.name} stats</span>
                    </a>
                  </div>
                </div> */}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  )
}
