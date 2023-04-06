import React, {Fragment, useState} from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Button } from "@/components/ui/button";
import { $http } from "@/plugins/http";
import { useToast } from "@/hooks/toast.hook";
import { ModalProps } from "@/interfaces/modal.props";
import { FieldError, Form, Input, Label } from "../ui/form";
import { XIcon } from "@heroicons/react/outline";
import { Editor } from "../ui/editor";

interface Props extends ModalProps {
  courtCase: any;
}

export const HearingModal: React.FC<Props> = ({isOpen, onClose, courtCase}) => {
  const toast = useToast();

  const [name, setName] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [time, setTime] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const [loading, setLoading] = useState(false);

  const closeModal = () => {
    if (onClose) {
      onClose(false)
    }
  }

  const resetState = () => {
    setName("");
    setDate("");
    setTime("");
    setLocation("");
    setDescription("");
  }

  const saveHearing = async() => {
    setLoading(true);

    try {
      await $http.post("/hearings", {
        name,
        date,
        time,
        location,
        description,
        court_case_id: courtCase.id,
      });

      toast.show({message: "Hearing has been saved"});
      resetState();

      closeModal();
    } catch (error) {

    } finally {
      setLoading(false);
    }
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
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
          <div className="fixed inset-0 bg-gray-800 bg-opacity-60 transition-opacity opacity-100" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex justify-between items-center mb-4">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-semibold leading-6 text-natural-13"
                  >
                    Add Hearing
                  </Dialog.Title>

                  <button type="button" className="h-6 w-6 text-gray-700" onClick={closeModal}>
                    <XIcon />
                  </button>
                </div>

                <Form className="space-y-4" onSubmit={saveHearing}>
                  <div>
                    <Label>Next Hearing Name</Label>
                    <Input placeholder="Hearing Name" onChangeText={setName} />

                    <FieldError name="name" />
                  </div>

                  <div>
                    <Label>Next Hearing Date</Label>
                    <Input placeholder="Hearing Date" type="date" onChangeText={setDate} />

                    <FieldError name="date" />
                  </div>

                  <div>
                    <Label>Next Hearing Time</Label>
                    <Input placeholder="Hearing Time" type="time" onChangeText={setTime} />

                    <FieldError name="time" />
                  </div>

                  <div>
                    <Label>Next Hearing Location</Label>
                    <Input placeholder="Hearing Location" onChangeText={setLocation} />

                    <FieldError name="location" />
                  </div>

                  <div>
                    <Label>Description</Label>
                    <Editor onHTMLChange={setDescription} />

                    <FieldError name="description" />
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button onClick={closeModal} color="default" className="min-w-[120px]">Cancel</Button>

                    <Button isLoading={loading} type="submit" className="min-w-[120px]">
                      Save Next Hearing
                    </Button>
                  </div>
                </Form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
