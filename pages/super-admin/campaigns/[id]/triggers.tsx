import { TriggerList } from "@/components/campaign/TriggerList";
import { Button } from "@/components/ui/button";
import { Label, Select } from "@/components/ui/form";
import { withCampaignLayout } from "@/hoc/layout";
import { $http } from "@/plugins/http";
import { useCampaignSWR, useTriggerSWR } from "@/swr/campaign.swr";
import { LightningBoltIcon, PlusIcon } from "@heroicons/react/outline";
import { useRouter } from "next/router";
import React, { useState } from "react";

// Not sure about the naming
const automationOptions = [
  { name: "Case Created", value: "case_created" },
  { name: "Case Bought", value: "case_bought" },
  { name: "User Created", value: "user_created" },
  { name: "Comment Created", value: "comment_created" },
  { name: "Party Invited", value: "party_invited" },
  { name: "File Shared", value: "file_shared" },
];

const CampaignTriggerPage: React.FC = () => {
  const router = useRouter();

  const [triggers,,, mutate] = useTriggerSWR(router.query.id as string)
  const [ , , , mutateCampaign] = useCampaignSWR(router.query.id as string);

  const [isCreating, setIsCreating] = useState(false);

  const [name, setName] = useState("");

  const [loading, setLoading] = useState(false);

  const toggleCreating = () => setIsCreating(prev => !prev);

  const saveTrigger = async() => {
    setLoading(true);
    const campaignId = router.query.id as string;

    try {
      await $http.post(`/admin/campaign-triggers`, {
        name,
        campaign_id: campaignId,
      });

      await mutate();
      mutateCampaign()

      setName("");
      setIsCreating(false);
    } catch (error) {

    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="max-w-xl mx-auto">
        <div className="space-y-4">
          {(!triggers.length && !isCreating) && (
            <div>
              <div className="text-center">
                <LightningBoltIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No triggers</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by creating a new trigger.</p>
                <div className="mt-6">
                  <button
                    type="button"
                    onClick={toggleCreating}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                    New Trigger
                  </button>
                </div>
              </div>
            </div>
          )}

          {triggers.map((trigger, index) => (
            <TriggerList key={trigger.id} index={index} trigger={trigger} />
          ))}

          {!!triggers.length && !isCreating && (
            <div className="flex justify-center">
              <button type="button" onClick={toggleCreating} className="text-primary-1 border-2 rounded-full border-primary-1 border">
                <PlusIcon className="h-6 w-6" />
              </button>
            </div>
          )}

          {isCreating && (
            <div className="bg-white shadow-sm rounded-lg px-4 py-2">
              <div className="space-y-4">
                <div>
                  <Label>Trigger</Label>

                  <Select onChangeValue={setName} value={name}>
                    <option value="">Select Trigger</option>
                    {automationOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.name}
                      </option>
                    ))}
                  </Select>
                </div>

                <div className="flex space-x-2">
                  <Button onClick={saveTrigger} disabled={!name} isLoading={loading}>Save Trigger</Button>
                  <Button onClick={toggleCreating} color="default">
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default withCampaignLayout(CampaignTriggerPage, "Campaign - Triggers");
