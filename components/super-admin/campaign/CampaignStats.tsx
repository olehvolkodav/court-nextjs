import { $gql } from "@/plugins/http";
import { classNames } from "@/utils/classname";
import { CursorClickIcon, MailIcon, MailOpenIcon, PaperAirplaneIcon, PresentationChartLineIcon } from "@heroicons/react/outline";
import Link from "next/link";
import React, { useEffect } from "react";

const CAMPAIGN_STATS_QUERY = `
  query {
    admin_campaign_statistic {
      emails_sent
      emails_bounced
    }
  }
`

export const CampaignStats: React.FC = () => {
  const [campaignStats, setCampaignStats] = React.useState<any>();

  const stats = React.useMemo(() => {
    return [
      {
        title: "Emails sent",
        total: campaignStats?.emails_sent ?? 0,
        href: "/",
        icon: {
          component: PaperAirplaneIcon,
          className: "rotate-45",
          background: "bg-green-500"
        },
      },
      {
        title: "Emails opens",
        total: 0,
        href: "/",
        icon: {
          component: MailOpenIcon,
          background: "bg-primary-1"
        },
      },
      {
        title: "Emails clicked",
        total: 0,
        href: "/",
        icon: {
          component: CursorClickIcon,
          background: "bg-[#1EB8FE]"
        },
      },
      {
        title: "Bounced",
        total: campaignStats?.emails_bounced ?? 0,
        href: "/",
        icon: {
          component: PresentationChartLineIcon,
          background: "bg-[#FFA800]"
        },
      },
      {
        title: "Unsubscribed",
        total: 0,
        href: "/",
        icon: {
          component: MailIcon,
          background: "bg-[#FD7972]"
        },
      },
    ];
  }, [campaignStats]);

  useEffect(() => {
    const getStats = async() => {
      try {
        const data = await $gql({
          query: CAMPAIGN_STATS_QUERY,
        });

        setCampaignStats(data.admin_campaign_statistic);
      } catch (error) {
      }
    }

    getStats();
  }, [])

  return (
    <div className="grid grid-cols lg:grid-cols-5 gap-4 mb-4">
      {stats.map((stat, index) => (
        <div className="bg-white rounded-lg px-4 py-6" key={index}>
          <span className={
            classNames("rounded-md h-10 w-10 flex items-center justify-center relative", stat.icon.background)
          }>
            <stat.icon.component
              className={
                classNames(
                  "h-6 w-6 text-white",
                  stat.icon.className,
                )
              }
            />
          </span>

          <h3 className="mt-2 mb-3 text-green-600 text-sm">{stat.title}</h3>

          <span className="text-2xl font-semibold">{stat.total}</span>

          <Link href="/">
            <a className="block text-sm text-primary-1 font-medium mb-4">See List</a>
          </Link>
        </div>
      ))}
    </div>
  )
}
