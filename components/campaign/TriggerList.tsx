import { $http } from "@/plugins/http";
import { useCampaignSWR, useTriggerSWR } from "@/swr/campaign.swr";
import { classNames } from "@/utils/classname";
import { TrashIcon } from "@heroicons/react/outline";
import { useRouter } from "next/router";
import React from "react";
import { Loading } from "../ui/loading/Loading";
import { TriggerSequence } from "./TriggerSequence";

export const TriggerList: React.FC<{trigger: any, index: number}> = ({trigger, index}) => {
  const router = useRouter()

  const [,,, mutate] = useTriggerSWR(router.query.id as string);
  const [ , , , mutateCampaign] = useCampaignSWR(router.query.id as string);

  const [loading, setLoading] = React.useState(false);

  const removeTrigger = (trigger: any) => async() => {
    setLoading(true);

    try {
      await $http.delete(`/admin/campaign-triggers/${trigger.id}`);
      await mutate();
      mutateCampaign()
    } catch (error) {

    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={
      classNames("bg-white shadow-sm rounded-lg", loading && "opacity-75")
    }>
      <div className="flex justify-between items-center px-4 py-2 border-b">
        <span className="capitalize font-medium text-sm text-natural-13">{index + 1}. {trigger.name.replace("_", " ")}</span>

        <button type="button" className="h-6 w-6 text-red-600" onClick={removeTrigger(trigger)} disabled={loading}>
          {loading ? <Loading /> : <TrashIcon />}
        </button>
      </div>

      <TriggerSequence trigger={trigger} />
    </div>
  )
}
