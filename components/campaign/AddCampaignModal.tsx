import { Button } from "@/components/ui/button";
import { Editor } from "@/components/ui/editor";
import { FieldError, Form, Input, Label, Select } from "@/components/ui/form";
import { ModalProps } from "@/interfaces/modal.props";
import { $http } from "@/plugins/http";
import { Dialog, Transition } from "@headlessui/react";
import Router from "next/router";
import { Fragment, useState } from "react";

interface Props extends ModalProps {}

const campaignPurposeOptions = [
  { value: "automation", label: "Automation" },
  { value: "instant", label: "Instant" }
];

export const AddCampaignModal: React.FC<Props> = ({isOpen, onClose}) => {
  const [name, setName] = useState("");
  const [purpose, setPurpose] = useState("automation");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(false);

  const handlePurposeChange = (event: any) => {
    setPurpose(event.target.value)
  }

  const closeModal = () => {
    if (onClose) {
      onClose(false)
    }
  }

  const saveCampaign = async() => {
    setLoading(true);

    try {
      const { data } = await $http.post("/admin/campaigns", {
        name,
        purpose,
        description,
      });

      Router.push({
        pathname: "/super-admin/campaigns/[id]",
        query: { id: data.id}
      })
    } catch (error) {

    } finally {
      setLoading(false)
    }
  }

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end sm:items-center justify-center min-h-full p-4 text-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative bg-white text-left rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-xl sm:w-full">
                <Form onSubmitPrevent={saveCampaign}>
                  <div className="px-4 py-2 border-b">
                    <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-natural-13">
                      New Campaign
                    </Dialog.Title>
                  </div>

                  <div className="px-4 py-2 space-y-4">
                    <div>
                      <Label>Name</Label>
                      <Input placeholder="Campaign Name" value={name} onChangeText={setName} />

                      <FieldError name="name" />
                    </div>

                    <div>
                      <Label>Purpose</Label>

                      <Select value={purpose} onChange={handlePurposeChange} name="purpose">
                        {
                          campaignPurposeOptions.map(option => (
                            <option value={option.value} key={option.value}>{option.label}</option>
                          ))
                        }
                      </Select>

                      <FieldError name="purpose" />
                    </div>

                    <div>
                      <Label>Description</Label>

                      <Editor onHTMLChange={setDescription} content={description} />

                      <FieldError name="description" />
                    </div>
                  </div>

                  <div className="px-4 py-2 flex space-x-2 border-t">
                    <Button type="submit" isLoading={loading}>
                      Save Campaign
                    </Button>

                    <Button color="default" onClick={closeModal}>
                      Cancel
                    </Button>
                  </div>
                </Form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
