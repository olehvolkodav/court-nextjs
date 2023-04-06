import { CampaignDetail } from "@/components/campaign/CampaignDetail";
import { InstantTemplate } from "@/components/campaign/InstantTemplate";
import { withCampaignLayout } from "@/hoc/layout";
import { NextPageWithLayout } from "@/interfaces/page.type";
import { useCampaignSWR } from "@/swr/campaign.swr";
import Head from "next/head";
import { useRouter } from "next/router";

const CampaignDetailPage: NextPageWithLayout = () => {
  const router = useRouter();

  const [campaign] = useCampaignSWR(router.query.id as string);

  return (
    <>
      <Head>
        <title key="title">
          Court - {campaign?.name || "Campaign"}
        </title>
      </Head>

      <div>
        {campaign?.purpose === "instant" && (
          <div className="bg-white rounded-lg shadow-sm px-4 py-2">
            {/* if no template attached */}
            <InstantTemplate />
          </div>
        )}

        <CampaignDetail />
      </div>
    </>
  )
}

export default withCampaignLayout(CampaignDetailPage);
