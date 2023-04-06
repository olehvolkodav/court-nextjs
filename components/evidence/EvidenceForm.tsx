import React, { useState } from "react";
import { Form, Label, Input, FieldError } from "@/components/ui/form";
import { RadioSelection } from "@/components/ui/radio/RadioSelection";
import { Editor } from "@/components/ui/editor/Editor";
import { MultiSelect } from "@/components/ui/multi-select/MultiSelect";
import { FileUpload } from "@/components/ui/file-upload/FileUpload";
import { Button } from "@/components/ui/button";
import { createRadioOptions } from "@/utils/options";
import { debounce } from "@/utils/debounce";
import { $gql } from "@/plugins/http";
import { $date } from "@/plugins/date";
import { ExclamationCircleIcon, PlusIcon } from "@heroicons/react/outline";
import { WitnessModal } from "./WitnessModal";
import { WitnessInfoModal } from "./WitnessInfoModal";
import { useRouter } from "next/router";

interface Props {
  onSubmit: (data: Record<string, any>) => any;
  loading?: boolean;
  evidence?: Record<string, any>;
  filesOnly?: boolean;
}

const typeOptions = createRadioOptions(["physical", "testimonial"]);

const signTypeOptions = createRadioOptions(["positive", "negative"]);

const SEARCH_WITNESSES = `
  query($search: String, $withEvidence: String) {
    my_witnesses(search: $search, withEvidence: $withEvidence) {
      id
      name
      email
    }
  }
`

export const EvidenceForm: React.FC<Props> = ({onSubmit, loading, evidence, filesOnly}) => {
  const router = useRouter()

  const [title, setTitle] = useState(evidence?.title ?? "");
  const [type, setType] = useState<string>(evidence?.type ?? "physical");
  const [main_points, setMainPoints] = useState<string | undefined>(evidence?.main_points);
  const [prove_explanation, setProve] = useState<string | undefined>(evidence?.prove_explanation);
  const [sign_type, setSignType] = useState<string>(evidence?.sign_type ?? "positive");
  const [date_occurred, setDateOccurred] = useState(() => {
    return $date(evidence?.date_occurred).format("YYYY-MM-DD") ?? ""
  });
  const [who_was_present, setWhoWasPresent] = useState(evidence?.who_was_present ?? "");

  const [ files, setFiles ] = useState<any[]>(evidence?.files ?? []);
  const [witnesses, setWitnesses] = useState<any[]>(evidence?.witnesses ?? []);

  const [witnessOptions, setWitnessOptions] = useState<any[]>([]);

  const [witnessModalOpen, setWitnessModalOpen] = useState(false);

  const [witnessInfoOpen, setWitnessInfoOpen] = useState(false);

  const appendFile = (file: any) => {
    setFiles(prev => [...prev, file]);
  }

  const removeFile = (file: any) => {
    setFiles(prev => prev.filter(prevFile => prevFile.id != file.id));
  }

  const onWitnessInputChange = debounce(async(value: string) => {
    if (!!value) {
      const withEvidence = evidence?.id ? `false,${evidence.id}` : "false"

      try {
        const data = await $gql({
          query: SEARCH_WITNESSES,
          variables: {
            search: `%${value}%`,
            withEvidence,
          }
        });

        setWitnessOptions(data.my_witnesses);
      } catch (error) {

      }
    }
  }, 300)

  const handleSubmit = () => {
    return onSubmit({
      title,
      type,
      main_points,
      sign_type,
      prove_explanation,
      date_occurred,
      who_was_present,
      files: files.map(file => file.id),
      witnesses: witnesses.map(w => w.id),
      court_case_id: router.query.case
    })
  }

  const handleWitnessAdded = (witness: any) => {
    setWitnesses(prev => [...prev, witness]);

    setWitnessModalOpen(false)
  }

  return (
    <Form onSubmitPrevent={handleSubmit} className="bg-white shadow-sm rounded-md">
      <div className="px-4 py-2 space-y-4">
        {!filesOnly && (
          <>
            <div>
              <Label>Evidence Information</Label>

              <div className="flex">
                <RadioSelection value={type} onChange={setType} options={typeOptions} />
              </div>
            </div>

            <div>
              <Label>Evidence Title</Label>
              <Input value={title} onChangeText={setTitle} placeholder="Evidence Title" />

              <FieldError name="title" />
            </div>

            <div>
              <Label>Date Occurred</Label>
              <Input type="date" value={date_occurred} onChangeText={setDateOccurred} />

              <FieldError name="date_occurred" />
            </div>

            <div>
              <Label>Who Was Present</Label>
              <Input value={who_was_present} onChangeText={setWhoWasPresent} placeholder="John Doe" />
            </div>

            <div>
              <div className="flex">
                <RadioSelection value={sign_type} onChange={setSignType} options={signTypeOptions} />
              </div>
            </div>

            <div>
              <Label>Main Points</Label>
              <Editor onHTMLChange={setMainPoints} content={main_points} />

              <FieldError name="main_points" />
            </div>

            <div>
              <div className="flex items-center mb-1">
                <Label className="block text-sm font-medium text-gray-700 mr-2">Witnesses</Label>

                <button type="button" onClick={() => setWitnessInfoOpen(true)}>
                  <ExclamationCircleIcon className="h-6 w-6 text-primary-1" />
                </button>
              </div>

              <div className="flex space-x-2">
                <div className="flex-1">
                  <MultiSelect
                    keyBy="id"
                    labelBy="name"
                    options={witnessOptions}
                    onInput={onWitnessInputChange}
                    onValueChange={setWitnesses}
                    value={witnesses}
                    placeholder="Search by Name - First, Last"
                  />
                </div>

                <button
                  type="button"
                  className="rounded-lg border border-gray-300 hover:border-gray-400 text-gray-700 text-gray-600 w-10 inline-flex justify-center items-center"
                  onClick={() => setWitnessModalOpen(true)}
                >
                  <PlusIcon className="h-6 w-6" />
                </button>
              </div>
            </div>
          </>
        )}

        <div>
          <Label>Evidence Documents</Label>

          <FileUpload files={files} onUploaded={appendFile} onFileDeleted={removeFile} />
        </div>

        {!filesOnly && (
          <div>
            <Label>What Does it Prove?</Label>

            <Editor onHTMLChange={setProve} content={prove_explanation} />

            <FieldError name="prove_explanation" />
          </div>
        )}
      </div>

      <div className="px-4 py-2 border-t flex justify-end space-x-2">
        <Button isLoading={loading} type="submit">
          {!!evidence ? "Update Evidence" : "Add Evidence"}
        </Button>
      </div>

      <WitnessModal
        isOpen={witnessModalOpen}
        onClose={setWitnessModalOpen}
        onWitnessAdded={handleWitnessAdded}
      />

      <WitnessInfoModal
        isOpen={witnessInfoOpen}
        onClose={setWitnessInfoOpen}
      />
    </Form>
  )
}

EvidenceForm.defaultProps = {
  filesOnly: false,
}
