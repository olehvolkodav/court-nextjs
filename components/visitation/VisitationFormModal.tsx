import { useCaseDashboard } from "@/hooks/case.hook";
import { ModalProps } from "@/interfaces/modal.props";
import { $http } from "@/plugins/http";
import { $errorActions } from "@/store/error.store";
import { classNames } from "@/utils/classname";
import { XIcon } from "@heroicons/react/outline";
import { useState } from "react";
import { Button } from "../ui/button";
import { Label, Input, FieldError, Select, Form, Textarea } from "../ui/form";
import { Modal } from "../ui/modal";

interface Props extends ModalProps {
  onSaved?: () => any;
  visitation?: any;
}

const occursOptions = ["once", "daily", "weekly"];
const days = ["S", "M", "T", "W", "T", "F", "S"];

export const VisitationFormModal: React.FC<Props> = ({ isOpen, onClose, onSaved, visitation }) => {
  const [courtCase] = useCaseDashboard();

  const [title, setTitle] = useState("");
  const [start_at, setStartAt] = useState("");
  const [end_at, setEndAt] = useState("");
  const [occurs, setOccurs] = useState("weekly");
  const [description, setDescription] = useState("");

  const [selectedDays, setSelectedDays] = useState<number[]>(
    days.map((_, index) => index)
  );

  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    $errorActions.setErrors({});
    setTitle("");
    setStartAt("");
    setEndAt("");
    setOccurs("weekly");
    setDescription("");
    setSelectedDays([]);
  }

  const handleSelectDay = (index: number) => () => {
    setSelectedDays(prev => {
      if (prev.includes(index)) {
        return prev.filter(day => day !== index);
      } else {
        return [...prev, index];
      }
    })
  }

  const isDaySelected = (index: number) => {
    return selectedDays.includes(index);
  }

  const closeModal = () => {
    resetForm();

    if (onClose) {
      onClose(false);
    }
  }

  const saveVisitation = async () => {
    setLoading(true);

    try {
      await $http.post("/visitations", {
        title,
        start_at,
        end_at: occurs === "once" ? start_at : end_at,
        occurs,
        description,
        occurs_data: selectedDays,
        court_case_id: courtCase.id
      });

      resetForm();

      if (onSaved) {
        onSaved();
      }
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
            <Form onSubmitPrevent={saveVisitation}>
              <div className="px-4 py-2 border-b flex justify-between items-center">
                <h3 className="text-lg font-medium leading-6 text-gray-700">
                  Schedule Visitation
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

                <div className="grid grid-cols lg:grid-cols-2 gap-4">
                  <div>
                    <Label>Start</Label>
                    <Input type="datetime-local" value={start_at} onChangeText={setStartAt} />
                    <FieldError name="start_at" />
                  </div>

                  {occurs !== "once" && (
                    <div>
                      <Label>End</Label>
                      <Input type="datetime-local" value={end_at} onChangeText={setEndAt} />
                      <FieldError name="end_at" />
                    </div>
                  )}
                </div>

                <div className="grid grid-cols lg:grid-cols-2 gap-4">
                  <div>
                    <Label>Occurs</Label>
                    <Select value={occurs} onChangeValue={setOccurs}>
                      {occursOptions.map((option) => (
                        <option value={option} className="capitalize" key={option}>
                          {option}
                        </option>
                      ))}
                    </Select>
                  </div>
                </div>

                {occurs === "weekly" && (
                  <div>
                    <Label>Repeat On</Label>

                    <div className="flex">
                      {days.map((day, index) => (
                        <button
                          type="button"
                          key={index}
                          className={classNames(
                            "font-medium h-10 w-10 mr-2 inline-flex items-center justify-center p-1",
                            "shadow rounded-lg",
                            isDaySelected(index) ? "bg-primary-1 text-white" : "bg-white border border-gray-300"
                          )}
                          onClick={handleSelectDay(index)}
                        >
                          {day}
                        </button>
                      ))}
                    </div>

                    <FieldError name="occurs_data">
                      the repeat on field is required.
                    </FieldError>
                  </div>
                )}

                <div>
                  <Label>Description</Label>
                  <Textarea value={description} onChangeText={setDescription} />
                  <FieldError name="description" />
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
