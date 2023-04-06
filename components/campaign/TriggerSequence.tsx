import { $http } from "@/plugins/http";
import { useSearchTemplateSWR, useTriggerSWR } from "@/swr/campaign.swr";
import { TrashIcon } from "@heroicons/react/outline";
import { useRouter } from "next/router";
import React, { useMemo, useState } from "react";
import { Button } from "../ui/button";
import { FieldError, Input, Label, Select } from "../ui/form";
import { SequenceList } from "./SequenceList";

interface SequenceDate {
  days: number;
  hours: number;
  minutes: number;
}

const defaultSequenceDate = [
  {days: 0, hours: 0, minutes: 0},
]

export const TriggerSequence: React.FC<{trigger: any}> = ({trigger}) => {
  const router = useRouter();

  const [,,, mutate] = useTriggerSWR(router.query.id as string);
  const [templates] = useSearchTemplateSWR({load: true});

  const [template_id, setTemplateId] = useState("");

  const [dates, setDates] = useState<SequenceDate[]>(defaultSequenceDate)

  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleCreating = () => setIsCreating(prev => !prev);

  const saveSequence = async() => {
    setLoading(true);

    try {
      await $http.post("/admin/campaign-sequences", {
        template_id,
        campaign_trigger_id: trigger.id,
        campaign_id: router.query.id,
        dates,
      });

      await mutate();

      setTemplateId("");
      setDates(defaultSequenceDate)
      setIsCreating(false);
    } catch (error) {

    } finally {
      setLoading(false);
    }
  }

  const disabledButton = useMemo(() => {
    return loading || !template_id;
  }, [loading, template_id]);

  const addSchedule = () => {
    setDates(prev => {
      return [
        ...prev,
        {hours: 0, minutes: 0, days: 0},
      ]
    })
  }

  const handleDateChange = (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setDates(prev => {
      return prev.map((date, i) => {
        if (i === index) {
          return {
            ...date,
            [e.target.name]: value,
          }
        }

        return date;
      })
    })
  }

  return (
    <div>
      {!!trigger.sequences?.length && (
        <div className="divide-y border-b">
          {trigger.sequences?.map((sequence: any) => (
            <SequenceList key={`trigger-${trigger.id}-sequence-${sequence.id}`} sequence={sequence} />
          ))}
        </div>
      )}

      {!isCreating ? (
        <div className="px-4 py-2">
          <button type="button" className="text-primary-1 text-sm font-medium" onClick={toggleCreating}>
            + Add Sequence
          </button>
        </div>
      ): (
        <div className="space-y-4 px-4 py-2">
          <div>
            <Label>Template</Label>
            <Select value={template_id} onChangeValue={setTemplateId}>
              <option value="">Select Template</option>
              {templates.map(template => (
                <option key={template.id} value={template.id}>
                  {template.name}
                </option>
              ))}
            </Select>

            <FieldError name="template_id" />
          </div>

          <div>
            <p className="text-gray-600 text-xs mb-1">
              Not providing date will send the sequence immediately.
            </p>

            <div className="space-y-2">
              {dates.map((date, index) => (
                <div className="flex items-center space-x-2" key={index}>
                  <span className="text-sm text-gray-600">Day(s)</span>
                  <Input value={date.days} type="number" max={30} name="days" onChange={handleDateChange(index)} />

                  <span className="text-sm text-gray-600">Hour(s)</span>
                  <Input value={date.hours} type="number" max={30} name="hours" onChange={handleDateChange(index)} />

                  <span className="text-sm text-gray-600">Minute(s)</span>
                  <Input value={date.minutes} type="number" max={30} name="minutes" onChange={handleDateChange(index)}/>

                  <button type="button" className="text-red-500">
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>

            {dates.length < 5 && (
              <div className="flex justify-center mt-2">
                <button
                  type="button"
                  className="text-primary-1 text-sm font-medium"
                  onClick={addSchedule}
                >
                  + Add Schedule
                </button>
              </div>
            )}
          </div>

          <div className="flex space-x-2">
            <Button isLoading={loading} onClick={saveSequence} disabled={disabledButton}>
              Add Sequence
            </Button>

            <Button color="default" onClick={toggleCreating}>Cancel</Button>
          </div>
        </div>
      )}
    </div>
  )
}
