// we dont reuse VisitationFormModal because only few fields are used
import { ModalProps } from "@/interfaces/modal.props";
import { $date } from "@/plugins/date";
import { $http } from "@/plugins/http";
import { $errorActions } from "@/store/error.store";
import { XIcon } from "@heroicons/react/outline";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { FieldError, Form, Input, Label, Textarea } from "../ui/form";
import { Modal } from "../ui/modal";

interface Props extends ModalProps {
  visitation?: any;
  time?: string;
}

export const VisitationEditFormModal: React.FC<Props> = ({ visitation, isOpen, onClose, time: scheduleTime }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [time, setTime] = useState("");

  const [loading, setLoading] = useState(false);

  const closeModal = () => {
    if (onClose) {
      onClose(false);
    }
  }

  const updateVisitation = async () => {
    setLoading(true);

    try {
      const { data } = await $http.patch(`/visitations/${visitation.id}`, {
        title,
        description,
        time,
      });

      if (onClose) {
        onClose(false);
      }
    } catch (error) {

    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (isOpen) {
      setTitle(visitation?.title);
      setDescription(visitation?.description);
      setTime(scheduleTime || "");
    } else {
      $errorActions.setErrors({})
    }
  }, [isOpen, visitation, scheduleTime])

  return (
    <Modal isOpen={isOpen} onClose={closeModal}>
      <Modal.Backdrop />

      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center">
          <Modal.Content>
            <Form onSubmitPrevent={updateVisitation}>
              <div className="px-4 py-2 border-b flex justify-between items-center">
                <h3 className="text-lg font-medium leading-6 text-gray-700">
                  Edit Visitation
                </h3>

                <button type="button" onClick={closeModal} className="h-6 w-6 text-natural-13">
                  <XIcon />
                </button>
              </div>

              <div className="px-4 py-2 space-y-4">
                <div>
                  <Label>Title</Label>
                  <Input value={title} onChangeText={setTitle} />
                  <FieldError name="title" />
                </div>

                <div>
                  <Label>Description</Label>
                  <Textarea value={description} onChangeText={setDescription} />
                  <FieldError name="description" />
                </div>

                <div>
                  <Label>Time</Label>
                  <Input type="time" value={time} onChangeText={setTime} />
                  <FieldError name="time" />
                </div>
              </div>

              <div className="px-4 py-2 flex justify-end space-x-2 border-t">
                <Button color="default" onClick={closeModal}>
                  Cancel
                </Button>

                <Button type="submit" className="min-w-[80px]" isLoading={loading}>
                  Save
                </Button>
              </div>
            </Form>
          </Modal.Content>
        </div>
      </div>
    </Modal>
  )
}
