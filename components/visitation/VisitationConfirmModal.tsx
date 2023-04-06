import { ModalProps } from "@/interfaces/modal.props";
import { $date } from "@/plugins/date";
import { $http } from "@/plugins/http";
import { XIcon } from "@heroicons/react/outline";
import { useState } from "react";
import { Button } from "../ui/button";
import { FileUpload } from "../ui/file-upload/FileUpload";
import { FieldError, Form, Label, Textarea } from "../ui/form";
import { Modal } from "../ui/modal";

interface Props extends ModalProps {
  schedule: any;
  onSaved?: (schedule: any, apiUpdated?: boolean) => any;
}

export const VisitationConfirmModal: React.FC<Props> = ({ isOpen, onClose, schedule, onSaved }) => {
  const [confirmation_status, setConfirmationStatus] = useState("cancellation");
  const [attendance_details, setAttendanceDetails] = useState("");

  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<any[]>([]);

  const closeModal = () => {
    if (onClose) {
      onClose(false);
    }
  }

  const appendFile = (file: any) => {
    setFiles(prev => [...prev, file]);
  }

  const removeFile = (file: any) => {
    setFiles(prev => prev.filter(prevFile => prevFile.id != file.id));
  }

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setConfirmationStatus(e.target.value);
  }

  const submitNotAttended = async () => {
    setLoading(true);

    try {
      const { data } = await $http.patch(`/visitation-schedules/${schedule.id}`, {
        confirmation_status,
        attendance_details,
        attended: false,
        files: files.map(file => file.id),
      });

      if (onSaved) {
        onSaved(data, true);
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
            {!!schedule && (
              <Form onSubmitPrevent={submitNotAttended}>
                <div className="px-4 py-2 border-b flex justify-between items-center">
                  <h3 className="text-lg font-medium leading-6 text-gray-700">
                    Not Attended On {$date(schedule.date).format("MMM DD, YYYY")}
                  </h3>

                  <button type="button" onClick={closeModal} className="h-6 w-6 text-natural-13">
                    <XIcon />
                  </button>
                </div>

                <div className="px-4 py-2 space-y-4">
                  <div>
                    <Label>Confirm What Happened</Label>

                    <div className="space-x-4 flex items-center">
                      <div className="flex items-center">
                        <input
                          id="no_show"
                          name="confirmation_status"
                          type="radio"
                          className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                          checked={confirmation_status === "no_show"}
                          onChange={handleChange}
                          value="no_show"
                        />
                        <label htmlFor="no_show" className="ml-3">
                          <span className="block text-sm font-medium text-gray-700">No Show</span>
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="cancellation"
                          name="confirmation_status"
                          type="radio"
                          className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                          checked={confirmation_status === "cancellation"}
                          onChange={handleChange}
                          value="cancellation"
                        />
                        <label htmlFor="cancellation" className="ml-3">
                          <span className="block text-sm font-medium text-gray-700">Cancellation</span>
                        </label>
                      </div>
                    </div>

                    <FieldError name="confirmation_status" />
                  </div>

                  <div>
                    <Label>Attendance Details</Label>
                    <Textarea value={attendance_details} onChangeText={setAttendanceDetails} />

                    <FieldError name="attendance_details" />
                  </div>

                  <div>
                    <Label>Upload Documents or Proof</Label>

                    <FileUpload files={files} onUploaded={appendFile} onFileDeleted={removeFile} />
                  </div>
                </div>

                <div className="px-4 py-2 space-x-2 flex justify-end border-t">
                  <Button color="default" onClick={closeModal}>
                    Cancel
                  </Button>

                  <Button type="submit" isLoading={loading} className="min-w-[80px]">
                    Save
                  </Button>
                </div>
              </Form>
            )}
          </Modal.Content>
        </div>
      </div>
    </Modal>
  )
}
