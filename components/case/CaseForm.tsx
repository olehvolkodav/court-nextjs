import { $date } from "@/plugins/date";
import { $http } from "@/plugins/http";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { Form, Label, Input, FieldError, Textarea } from "../ui/form";
import { RadioSelection } from "../ui/radio/RadioSelection";

const roleOptions = [
  { name: "Plaintiff", value: "plaintiff" },
  { name: "Defendant", value: "defendant"},
]

export const CaseForm: React.FC<{courtCase?: any}> = ({courtCase}) => {
  const router = useRouter();

  const [role, setRole] = useState(courtCase?.role || "plaintiff");
  const [name, setName] = useState<string>(courtCase?.name || "");
  const [date, setDate] = useState<string>(() => {
    return $date(courtCase?.date).format("YYYY-MM-DD") ?? ""
  });
  const [court_room_number, setCourtRoomNumber] = useState<string>(courtCase?.court_room_number || "");
  const [case_number, setCaseNumber] = useState<string>(courtCase?.case_number || "");
  const [judge_name, setJudgeName] = useState<string>(courtCase?.judge_name || "");
  const [country, setCountry] = useState<string>(courtCase?.country || "");
  const [state, setState] = useState<string>(courtCase?.state || "");
  const [city, setCity] = useState<string>(courtCase?.city || "");
  const [address, setAddress] = useState<string>(courtCase?.address || "");

  const [loading, setLoading] = useState(false);

  const handleSubmit = async() => {
    setLoading(true);

    const url = courtCase?.id ? `/cases/${courtCase.id}` : "/cases";
    const method = courtCase?.id ? "PATCH" : "POST";

    try {
      const { data } = await $http({
        method,
        url,
        data: {
          name,
          role,
          date,
          court_room_number,
          case_number,
          judge_name,
          country,
          state,
          city,
          address,
        }
      })

      router.replace(`/dashboard/${data.courtCase.id}`);
    } catch (error) {

    } finally {
      setLoading(false)
    }
  }

  const goBack = () => router.back();

  return (
    <Form className="grid grid-cols lg:grid-cols-12 gap-4" onSubmitPrevent={handleSubmit}>
      <div className="lg:col-span-8">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-4 lg:p-6 space-y-4">
            <div>
              <Label>Name</Label>
              <Input placeholder="Case Name" onChangeText={setName} value={name} />

              <FieldError name="name" />
            </div>

            <div>
              <Label>Case Number</Label>
              <Input placeholder="Case Number" onChangeText={setCaseNumber} value={case_number} />

              <FieldError name="case_number" />
            </div>

            <div>
              <Label>Date Filed</Label>
              <Input placeholder="Date" type="date" onChangeText={setDate} value={date} />

              <FieldError name="date" />
            </div>

            <div>
              <Label>Judge Name</Label>
              <Input placeholder="Judge Name" onChangeText={setJudgeName} value={judge_name} />

              <FieldError name="judge_name" />
            </div>

            <div>
              <Label>Court Room Number</Label>
              <Input placeholder="Court Room Number" onChangeText={setCourtRoomNumber} value={court_room_number} />

              <FieldError name="court_room_number" />
            </div>

            <div>
              <Label>Who Are You?</Label>

              <div className="flex">
                <RadioSelection label="Who Are you" options={roleOptions} onChange={setRole} value={role} />
              </div>

              <FieldError name="role" />
            </div>

            {/* <div>
              <Label>Description</Label>
              <Editor content={body} onHTMLChange={setBody} />

              <FieldError name="body" />
            </div> */}
          </div>
        </div>
      </div>

      <div className="lg:col-span-4">
        <div className="bg-white rounded-lg shadow-sm p-4 lg:p-6 space-y-4">
          <div>
            <h3 className="text-gray-800 font-semibold">Court Location</h3>
          </div>

          <div>
            <Label>Country</Label>
            <Input placeholder="Country" onChangeText={setCountry} value={country} />

            <FieldError name="country" />
          </div>

          <div>
            <Label>State</Label>
            <Input placeholder="State" onChangeText={setState} value={state} />

            <FieldError name="state" />
          </div>

          <div>
            <Label>City</Label>
            <Input placeholder="City" onChangeText={setCity} value={city} />

            <FieldError name="city" />
          </div>

          <div>
            <Label>Address</Label>
            <Textarea placeholder="Address" onChangeText={setAddress} value={address} />

            <FieldError name="address" />
          </div>
        </div>
      </div>

      <div className="lg:col-span-12">
        <div className="px-4 py-2 border-t flex justify-end space-x-2">
          <Button type="button" onClick={goBack} color="default" className="bg-white">Cancel</Button>
          <Button isLoading={loading} type="submit">Save Case</Button>
        </div>
      </div>
    </Form>
  )
}
