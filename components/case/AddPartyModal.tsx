import React, {Fragment, useState} from "react";
import { Dialog, Transition, RadioGroup } from "@headlessui/react";
import { Button } from "@/components/ui/button";
import { $http } from "@/plugins/http";
import { useToast } from "@/hooks/toast.hook";
import { ModalProps } from "@/interfaces/modal.props";
import { Input } from "../ui/form";
import { classNames } from "@/utils/classname";
import { UserAddIcon, UserIcon, XIcon } from "@heroicons/react/outline";

interface Props extends ModalProps {
  courtCase: any;
}

const options = [
  { name: "viewer", description: "Viewer will be able to upload files and only view specific files and folders", icon: UserIcon},
  { name: "editor", description: "Editor will have full access and able to upload files, share files, download and print files.", icon: UserAddIcon},
]

export const AddPartyModal: React.FC<Props> = ({isOpen, onClose, courtCase}) => {
  const toast = useToast();

  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("viewer");
  const [email, setEmail] = useState<string>("");

  const closeModal = () => {
    if (onClose) {
      onClose(false)
    }
  }

  const inviteUser = async() => {
    setLoading(true);

    try {
      await $http.post("/party-invitations", {
        email,
        role,
        case_id: courtCase.id,
      });
      setEmail("")

      toast.show({message: "Invitation has been sent"});

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
                    Invite Teammate
                  </Dialog.Title>

                  <button type="button" className="h-6 w-6 text-gray-700" onClick={closeModal}>
                    <XIcon />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <Input
                      type="email" onChangeText={setEmail}
                      value={email}
                      placeholder="Teammate email address"
                      className="lg:text-sm border-0 w-full focus:border-0 focus:outline-none focus:ring-0 border-b focus:border-b px-0"
                    />
                  </div>

                  <div>
                    <span className="text-lg font-medium text-natural-13 block mb-4">Teammate Permissions</span>

                    <RadioGroup value={role} onChange={setRole}>
                      <RadioGroup.Label className="sr-only">Privacy option</RadioGroup.Label>
                        <div className="space-y-3">
                          {options.map((option, optionIdx) => (
                            <RadioGroup.Option
                              key={option.name}
                              value={option.name}
                              className={({ checked }) =>
                                classNames(
                                  checked ? "bg-indigo-50 border-indigo-200 z-10" : "border-gray-200",
                                  "relative border p-4 flex cursor-pointer focus:outline-none items-center bg-white rounded-md"
                                )
                              }
                            >
                              {({ active, checked }) => (
                                <>
                                  <span
                                    className={classNames(
                                      checked ? "bg-indigo-600 border-transparent" : "bg-white border-gray-300",
                                      active ? "ring-2 ring-offset-2 ring-indigo-500" : "",
                                      "h-4 w-4 mt-0.5 cursor-pointer shrink-0 rounded-full border flex items-center justify-center"
                                    )}
                                    aria-hidden="true"
                                  >
                                    <span className="rounded-full bg-white w-1.5 h-1.5" />
                                  </span>

                                  <div className="ml-2 mr-1">
                                    <option.icon className={classNames(checked ? "text-indigo-500" : "text-gray-500", "h-7 w-7")} />
                                  </div>

                                  <span className="ml-3 flex flex-col">
                                    <RadioGroup.Label
                                      as="span"
                                      className={classNames(checked ? "text-indigo-900" : "text-gray-900", "block text-sm font-medium capitalize")}
                                    >
                                      Invite as {option.name}
                                    </RadioGroup.Label>
                                    <RadioGroup.Description
                                      as="span"
                                      className={classNames(checked ? "text-indigo-700" : "text-gray-500", "block text-sm")}
                                    >
                                      {option.description}
                                    </RadioGroup.Description>
                                  </span>
                                </>
                              )}
                            </RadioGroup.Option>
                          ))}
                        </div>
                    </RadioGroup>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button onClick={closeModal} color="default" className="min-w-[120px]">Cancel</Button>

                    <Button onClick={inviteUser} isLoading={loading} className="min-w-[120px]" disabled={!email || loading}>
                      Invite
                    </Button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
