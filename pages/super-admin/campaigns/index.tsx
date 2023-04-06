import React, { useEffect, useReducer, useState } from "react"
import { withAdminLayout } from "@/hoc/layout";
import { $date } from "@/plugins/date";
import Link from "next/link";
import { NextPageWithLayout } from "@/interfaces/page.type";
import { $gql } from "@/plugins/http";
import { PAGINATION_FIELD, PAGINATION_PARAMS, PAGINATION_VARS, parsePage } from "@/graphql/query/util";
import { useRouter } from "next/router";
import { Pagination } from "@/components/ui/pagination";
import { paginationInitialState, paginationReducer } from "@/reducers/pagination.reducer";
import { CampaignStats } from "@/components/super-admin/campaign/CampaignStats";
import { AddCampaignModal } from "@/components/campaign/AddCampaignModal";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "@heroicons/react/outline";
import { classNames } from "@/utils/classname";

const CAMPAIGNS_QUERY = `
  query(${PAGINATION_PARAMS}) {
    campaigns: admin_campaigns(${PAGINATION_VARS}) {
      data {
        id
        name
        purpose
        status
        created_at
      }
      ${PAGINATION_FIELD}
    }
  }
`

const CampaignsPage: NextPageWithLayout = () => {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [pagination, dispatch] = useReducer(paginationReducer, paginationInitialState);

  const [isCreating, setIsCreating] = useState(false);

  const openModal = () => setIsCreating(true);

  useEffect(() => {
    const page = parsePage(router.query.page);

    const getCampaigns = async() => {
      try {
        const data = await $gql({
          query: CAMPAIGNS_QUERY,
          variables: { page }
        });

        setCampaigns(data.campaigns.data);
        dispatch({
          type: "set",
          value: data.campaigns.paginatorInfo
        })
      } catch (error) {

      }
    }

    getCampaigns()
  }, [router.query.page]);

  return (
    <div className="py-4">
      <div className="container px-4 mx-auto sm:px-6 lg:px-8">
        <CampaignStats />

        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-semibold text-gray-900">Campaigns</h1>

          <div className="flex items-center">
            <Button type="button" onClick={openModal}>
              <PlusIcon className="h-5 w-5 mr-2 -ml-px" />
              New Campaign
            </Button>
          </div>
        </div>

        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <table className="x-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Purpose</th>
                <th>Status</th>
                <th>Created</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {campaigns.map(campaign => (
                <tr key={campaign.id}>
                  <td>{campaign.name}</td>
                  <td className="capitalize">{campaign.purpose.replace("_", " ")}</td>
                  <td className="flex items-center">
                    <span className="capitalize">{campaign.status}</span>

                    <span className="flex h-2.5 w-2.5 ml-2 relative">
                      {campaign.status === "running" && (
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75" />
                      )}
                      <span
                        className={classNames(
                          "relative inline-flex rounded-full h-2.5 w-2.5",
                          ["running", "completed"].includes(campaign.status) && "bg-sky-500",
                          campaign.status === "pending" && "bg-yellow-500"
                        )}
                      />
                    </span>
                  </td>
                  <td>
                    {$date(campaign.created_at).format("YYYY-MM-DD hh:mm A")}
                  </td>
                  <td>
                    <Link href={{
                      pathname: "/super-admin/campaigns/[id]",
                      query: {id: campaign.id}
                    }}>
                      <a className="text-primary-1 font-medium">Detail</a>
                    </Link>
                  </td>
                </tr>
              ))}

              {!campaigns.length && (
                <tr>
                  <td colSpan={4} className="text-center">No Campaigns</td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="border-t px-4 py-2">
            <Pagination data={pagination} />
          </div>
        </div>
      </div>

      <AddCampaignModal isOpen={isCreating} onClose={setIsCreating} />
    </div>
  )
}
export default withAdminLayout(CampaignsPage, "Court - Campaigns");
