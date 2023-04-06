import React, { useState } from "react";
import { Form, FieldError, Input, Label, PhoneInput } from "@/components/ui/form";
import { RadioOptions, RadioSelection } from "../ui/radio/RadioSelection";
import { Editor } from "../ui/editor/Editor";
import { Button } from "../ui/button";
import { FileUpload } from "../ui/file-upload/FileUpload";
import { ExclamationCircleIcon } from "@heroicons/react/outline";
import { CredibilityInfoModal } from "./CredibilityInfoModal";
import { useCaseDashboard } from "@/hooks/case.hook";

interface Props {
  onSubmit: (data: any) => any;
  loading?: boolean;
  witness?: Record<string, any> | undefined;
}

const relationOptions: RadioOptions[] = [
  {name: "Mine", value: "mine"},
  { name: "Opposition", value: "opposition"}
];

const witnessTypeOptions: RadioOptions[] = [
  { name: "Expert", value: "expert"},
  { name: "Non Expert", value: "non_expert"},
];

const witnessStatusOptions: RadioOptions[] = [
  {name: "Confirmed", value: "confirmed"},
  { name: "Subpoenaed", value: "subpoenaed"}
]

export const WitnessForm: React.FC<Props> = ({onSubmit, loading, witness}) => {
  const [courtCase] = useCaseDashboard();

  const [first_name, setFirstName] = useState(witness?.first_name || "");
  const [last_name, setLastName] = useState<string>(witness?.last_name ?? "");
  const [main_points, setMainPoints] = useState<string>(witness?.main_points ?? "");
  const [relation, setRelation] = useState(witness?.relation || "mine");
  const [type, setType] = useState(witness?.type || "expert");
  const [status, setStatus] = useState(witness?.status || "confirmed");
  const [phone_number, setPhoneNumber] = useState(witness?.phone_number ?? "");
  const [address, setAddress] = useState<string>(witness?.address ?? "");
  const [email, setEmail] = useState<string>(witness?.email ?? "");
  const [organization, setOrganization] = useState<string>(witness?.organization ?? "");
  const [label, setLabel] = useState<string>(witness?.label ?? "");
  const [credibility_issue, setCredibilityIssue] = useState<string>(witness?.credibility_issue ?? "");
  const [files, setFiles] = useState<any[]>(witness?.files ?? []);

  const [infoModalOpen, setInfoModalOpen] = useState(false);

  const appendFile = (file: any) => {
    setFiles(prev => [...prev, file]);
  }

  const removeFile = (file: any) => {
    setFiles(prev => prev.filter(prevFile => prevFile.id != file.id));
  }

  const onRadioChange = (prop: string = "event") => (value: any) => {
    switch (prop) {
      case "relation":
        setRelation(value)
        break;
      case "type":
        setType(value);
        break;
      case "status":
        setStatus(value);
        break;
      default:
        break;
    }
  }

  const handleSubmit = () => {
    return onSubmit({
      first_name,
      last_name,
      email,
      address,
      main_points,
      relation,
      type,
      status,
      organization,
      label,
      credibility_issue,
      phone_number,
      phone_code: "+1",
      files: files.map(file => file.id),
      court_case_id: courtCase.id,
    })
  }

  return (
    <Form className="bg-white shadow-sm rounded-md" onSubmitPrevent={handleSubmit}>
      <div className="p-4 lg:p-6 space-y-4">
        <div className="grid grid-cols lg:grid-cols-2 gap-2">
          <div>
            <Label>First Name</Label>

            <Input value={first_name} placeholder="First Name" onChangeText={setFirstName} />

            <FieldError name="first_name" />
          </div>

          <div>
            <Label>Last Name</Label>

            <Input value={last_name} placeholder="Last Name" onChangeText={setLastName} />

            <FieldError name="last_name" />
          </div>
        </div>

        <div>
          <Label>Email</Label>

          <Input value={email} type="email" placeholder="email@gmail.com" onChangeText={setEmail} />

          <FieldError name="email" />
        </div>

        <div>
          <Label>Phone Number</Label>

          <PhoneInput value={phone_number} onPhoneChange={setPhoneNumber} />

          <FieldError name="phone_number" />
        </div>

        <div>
          <Label>Address</Label>

          <Input value={address} onChangeText={setAddress} placeholder="10198 N State 75 Rd North Salem, Indiana" />

          <FieldError name="address" />
        </div>

        <div>
          <Label>Organization</Label>

          <Input value={organization} onChangeText={setOrganization} />

          <FieldError name="organization" />
        </div>

        <div>
          <Label>Whose Witness?</Label>

          <div className="flex">
            <RadioSelection label="Who Are you" value={relation} options={relationOptions} onChange={onRadioChange("relation")} />
          </div>
        </div>

        <div>
          <Label>Main Points</Label>

          <Editor onHTMLChange={setMainPoints} limit={1200} content={main_points}>
            {({characters}) => (
              <>
                <FieldError name="main_points" />

                <div className="flex justify-between mt-2 text-sm text-gray-500">
                  <p>Maximum 1200 characters</p>

                  <p>{characters} / 1200</p>
                </div>
              </>
            )}
          </Editor>
        </div>

        <div>
          <Label>Label</Label>
          <Input value={label} onChangeText={setLabel} placeholder="e.g Husband, Neighbor" />

          <FieldError name="label" />
        </div>

        <div>
          <Label>Type of Witness</Label>

          <div className="flex">
            <RadioSelection label="Who Are you" value={type} options={witnessTypeOptions} onChange={onRadioChange("type")} />
          </div>
        </div>

        <div>
          <div className="flex items-center mb-1">
            <Label className="block text-sm font-medium text-gray-700 mr-2">Credibility Issue</Label>

            <button type="button" onClick={() => setInfoModalOpen(true)}>
              <ExclamationCircleIcon className="h-6 w-6 text-primary-1" />
            </button>
          </div>

          <Editor onHTMLChange={setCredibilityIssue} limit={200} content={credibility_issue}>
            {({characters}) => (
              <>
                <FieldError name="credibility_issue" />

                <div className="flex justify-between mt-2 text-sm text-gray-500">
                  <p>Maximum 200 characters</p>

                  <p>{characters} / 200</p>
                </div>
              </>
            )}
          </Editor>
        </div>

        <div>
          <Label>Physical Evidence To Submit</Label>

          <FileUpload
            onUploaded={appendFile}
            onFileDeleted={removeFile}
            files={files}
            id="witness-upload-files"
          />
        </div>

        <div>
          <Label>Witness Status</Label>

          <div className="flex">
            <RadioSelection label="Who Are you" value={status} options={witnessStatusOptions} onChange={onRadioChange("status")} />
          </div>
        </div>
      </div>

      <div className="border-t px-4 py-2 justify-end flex space-x-4">
        <Button isLoading={loading} type="submit">
          Save Witness
        </Button>
      </div>

      <CredibilityInfoModal isOpen={infoModalOpen} onClose={setInfoModalOpen} />
    </Form>
  )
}
