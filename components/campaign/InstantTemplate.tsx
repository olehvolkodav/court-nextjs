import { $date } from "@/plugins/date";
import { $http } from "@/plugins/http";
import { useCampaignSWR, useSearchTemplateSWR } from "@/swr/campaign.swr";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { Label, Select } from "../ui/form";

export const InstantTemplate: React.FC = () => {
  const router = useRouter();

  const [campaign,,, mutate] = useCampaignSWR(router.query.id as string);
  const [templates] = useSearchTemplateSWR({fetch: true});

  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(false);

  const [template_id, setTemplateId] = useState("");

  const saveSequence = async() => {
    setLoading(true);

    try {
      await $http.post("/admin/campaign-sequences", {
        campaign_id: campaign.id,
        template_id,
        send_at: $date().toISOString()
      });

      await mutate()

      setIsAdding(false);
    } catch (error) {

    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {!isAdding ? (
        <>
          {!campaign?.sequence?.template ? (
            <div className="text-center">
              <p className="text-gray-600 text-sm mb-2">No Template Provided</p>

              <Button size="sm" onClick={() => setIsAdding(true)}>Add Template</Button>
            </div>
          ) : (
            <div>
              <p className="text-gray-900">Template Name</p>
              <p className="text-sm text-gray-600">{campaign.sequence.template.name}</p>
            </div>
          )}
        </>
      ): (
        <div className="space-y-4">
          <div className="max-w-sm">
            <Label>Template</Label>
            <Select value={template_id} onChangeValue={setTemplateId}>
              <option value="">Select Template</option>
              {templates.map(template => (
                <option key={template.id} value={template.id}>{template.name}</option>
              ))}
            </Select>
          </div>

          <div>
            <Button isLoading={loading} onClick={saveSequence}>Add Template</Button>
          </div>
        </div>
      )}
    </>
  )
}
