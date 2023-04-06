import { $date } from "@/plugins/date";
import { $http } from "@/plugins/http";
import { useCampaignSWR, useTriggerSWR } from "@/swr/campaign.swr";
import { PencilIcon, TrashIcon } from "@heroicons/react/outline";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { Loading } from "../ui/loading";

export const SequenceList: React.FC<{sequence: any}> = ({sequence}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [campaign] = useCampaignSWR(router.query.id as string);
  const [, , , mutate] = useTriggerSWR(router.query.id as string);

  const removeSequence = async() => {
    setLoading(true);

    try {
      await $http.delete(`/admin/campaign-sequences/${sequence.id}`);
      await mutate()
    } catch (error) {

    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center space-x-4 px-4 py-2">
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-900">
          {sequence.template?.name}
        </p>

        {sequence?.dates?.map((sequenceDate: any, index: number) => (
          <p key={sequenceDate.id} className="text-xs text-gray-600 mt-1">
            {index + 1}. Delay {sequenceDate.days} day(s), {sequenceDate.hours} hour(s), {sequenceDate.minutes} minute(s)
          </p>
        ))}
      </div>

      <div className="flex items-center space-x-2">
        <button
          type="button"
          className="text-red-700"
          onClick={removeSequence}
        >
          {loading ? <Loading /> : <TrashIcon className="h-5 w-5" />}
        </button>
      </div>
    </div>
  )
}
