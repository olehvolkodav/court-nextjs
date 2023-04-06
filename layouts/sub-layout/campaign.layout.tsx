import { ErrorPage } from "@/components/error/ErrorPage";
import { Button } from "@/components/ui/button";
import { MenuLink } from "@/components/ui/link";
import { useToast } from "@/hooks/toast.hook";
import { ReactProps } from "@/interfaces/react.props";
import { $http } from "@/plugins/http";
import { useCampaignSWR } from "@/swr/campaign.swr";
import { classNames } from "@/utils/classname";
import { InformationCircleIcon, LightningBoltIcon, UsersIcon } from "@heroicons/react/outline";
import { useRouter } from "next/router";
import { useCallback, useMemo, useState } from "react";

export const CampaignLayout: React.FC<ReactProps> = ({children}) => {
  const toast = useToast();
  const router = useRouter();

  const [campaign, campaignLoading, error, mutate] = useCampaignSWR(router.query.id as string);

  const [loading, setLoading] = useState(false);

  const isActive = useCallback((href: string) => {
    return router.pathname == `/super-admin/campaigns/[id]${href}`;
  }, [router.pathname]);

  const tabs = useMemo(() => {
    const purpose = campaign?.purpose;

    const tab = {
      name: 'Triggers',
      href: '/triggers',
      icon: LightningBoltIcon,
    }

    const data = [
      { name: 'Details', href: '', icon: InformationCircleIcon},
    ];

    if (purpose == 'automation') {
      data.push(tab)
    } else {
      data.push({ name: 'Recipients', href: '/recipients', icon: UsersIcon });
    }

    return data;
  }, [campaign?.purpose]);

  const startCampaign = async() => {
    setLoading(true);

    try {
      await $http.patch(`/admin/campaigns/${campaign?.id}/start`, {});

      await mutate()

      toast.show({message: 'Campaign started'});
    } catch (err: any) {
      toast.show({
        message: err?.response?.data?.message ?? 'Failed to start campaign',
        status: 'error'
      });
    } finally {
      setLoading(false);
    }
  }

  if (!campaignLoading && !!error) {
    return <ErrorPage />
  }

  return (
    <div className="py-4">
      <div className="container px-4 mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-700">
            {campaign?.name}
          </h1>

          <div>
            {!['running', 'completed'].includes(campaign?.status) && (
              <Button isLoading={loading} onClick={startCampaign}>
                Start Campaign
              </Button>
            )}
          </div>
        </div>

        <div className="mb-4">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              {tabs.map((tab) => (
                <MenuLink
                  key={tab.name}
                  href={{
                    pathname: `/super-admin/campaigns/[id]${tab.href}`,
                    query: { id: router.query.id}
                  }}
                  className={classNames(
                      isActive(tab.href)
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                    'group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm'
                  )}
                >
                  <tab.icon
                    className={classNames(
                      isActive(tab.href)
                      ? 'text-indigo-500' : 'text-gray-400 group-hover:text-gray-500',
                      '-ml-0.5 mr-2 h-5 w-5'
                    )}
                    aria-hidden="true"
                  />
                  <span>{tab.name}</span>
                </MenuLink>
              ))}
            </nav>
          </div>
        </div>

        {children}
      </div>
    </div>
  )
}
