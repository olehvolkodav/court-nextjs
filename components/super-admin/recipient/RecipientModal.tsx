import { Button } from "@/components/ui/button";
import { FieldError, Form, Input, Label } from "@/components/ui/form";
import { Modal } from "@/components/ui/modal";
import { TagInput } from "@/components/ui/multi-select/TagInput";
import { ModalProps } from "@/interfaces/modal.props";
import { $http } from "@/plugins/http";
import React, { useState } from "react";

interface IRecipientModalProps extends ModalProps {
  onRecipientAdded?: (payload: Record<string, any>) => any;
}

export const RecipientModal: React.FC<IRecipientModalProps> = ({isOpen, onClose, onRecipientAdded}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [tags, setTags] = useState<any[]>([]);

  const [loading, setLoading] = useState(false);

  const resetState = () => {
    setName("");
    setEmail("");
    setTags([]);
  }

  const closeModal = () => {
    resetState();

    if (onClose) {
      onClose(false);
    }
  }

  const saveRecipient = async() => {
    setLoading(true);

    try {
      const { data } = await $http.post("/admin/recipients", {
        name,
        email,
        tags
      })

      if (onRecipientAdded) {
        onRecipientAdded(data)
      }

      resetState();
    } catch (error) {

    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={closeModal}>
      <Modal.Backdrop />

      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center">
          <Modal.Content>
            <div className="px-4 py-2 border-b">
              <span className="text-xl font-semibold text-gray-700">Add New Recipient</span>
            </div>

            <div className="space-y-4 px-4 py-2">
              <div>
                <Label>Name</Label>
                <Input placeholder="Recipient Name" required onChangeText={setName} />

                <FieldError name="name" />
              </div>

              <div>
                <Label>Email</Label>
                <Input type="email" required placeholder="Recipient Email" onChangeText={setEmail} />

                <FieldError name="email" />
              </div>

              <div>
                <Label>Tags (optional)</Label>
                <TagInput maxTag={5} placeholder="Add recipient tags"  onChange={setTags}/>
              </div>
            </div>

            <div className="border-t space-x-2 px-4 py-2">
              <Button onClick={saveRecipient} isLoading={loading}>Add Recipient</Button>
              <Button color="default" onClick={closeModal}>Cancel</Button>
            </div>
          </Modal.Content>
        </div>
      </div>
    </Modal>
  )
}
