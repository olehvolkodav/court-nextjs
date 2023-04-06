import { ModalProps } from "@/interfaces/modal.props";
import { $http } from "@/plugins/http";
import { XIcon } from "@heroicons/react/outline";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { FieldError, Input, Label, Select, Textarea } from "../ui/form";
import { Modal } from "../ui/modal";

interface IQuestionModalProps extends ModalProps {
  onQuestionAdded?: (question: any) => any
}

const placeOptions = ["evidence_form", "witness_form"];

export const AddQuestionModal: React.FC<IQuestionModalProps> = ({
  onQuestionAdded,
  isOpen,
  onClose
}) => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [place, setPlace] = useState("");

  const [loading, setLoading] = useState(false);

  const resetState = () => {
    setTitle("");
    setBody("");
    setPlace("")
  }

  const closeModal = () => {
    resetState();

    if (onClose) {
      onClose(false)
    }
  }

  const saveQuestion = async() => {
    setLoading(true);

    try {
      const { data } = await $http.post("/admin/questions", {
        title,
        body,
        place
      });

      resetState()

      if (onQuestionAdded) {
        onQuestionAdded(data);
      }
    } catch (error) {

    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Backdrop />

      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center">
          <Modal.Content>
            <div className="px-4 py-2 border-b flex items-center justify-between">
              <h4>Add New Question</h4>

              <button type="button" className="h-6 w-6 text-gray-700" onClick={closeModal}>
                <XIcon />
              </button>
            </div>

            <div className="px-4 py-2 space-y-4">
              <div>
                <Label>Question</Label>
                <Input placeholder="Question title" onChangeText={setTitle} />

                <FieldError name="title" />
              </div>

              <div>
                <Label>Put this question on</Label>
                <Select appendClassName="capitalize" onChangeValue={setPlace}>
                  <option value="">Don&apos;t put anywhere</option>
                  {placeOptions.map(option => (
                    <option key={option} className="capitalize" value={option}>
                      {option.replace("_"," ")}
                    </option>
                  ))}
                </Select>
              </div>

              <div>
                <Label>Answer</Label>
                <Textarea onChangeText={setBody} placeholder="Add Answer" />

                <FieldError name="body" />
              </div>
            </div>

            <div className="border-t px-4 py-2">
              <Button onClick={saveQuestion} isLoading={loading}>
                Save Question
              </Button>
            </div>
          </Modal.Content>
        </div>
      </div>
    </Modal>
  )
}
