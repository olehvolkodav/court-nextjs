import { useToast } from "@/hooks/toast.hook";
import { ModalProps } from "@/interfaces/modal.props";
import { $http } from "@/plugins/http";
import { XIcon } from "@heroicons/react/outline";
import { useState } from "react";
import { Button } from "../ui/button";
import { Input, Label } from "../ui/form";
import { Modal } from "../ui/modal";

interface Props extends ModalProps {
  task?: any;
  onSnooze?: (task: any) => any;
}

export const TaskSnoozeModal: React.FC<Props> = ({
  isOpen,
  onClose,
  task,
  onSnooze,
}) => {
  const toast = useToast();

  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);

  const closeModal = () => {
    setDate("");
    if (onClose) {
      onClose(false);
    }
  };

  const snoozeTask = async () => {
    setLoading(true);

    try {
      await $http.post(`/tasks/${task.id}/snooze`, {
        is_unsnooze: false,
        snooze_until: date,
      });

      if (onSnooze) {
        onSnooze(task);
      }

      toast.show({ message: "Task has been snoozed." });
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={closeModal}>
      <Modal.Backdrop />

      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center">
          <Modal.Content className="w-full max-w-2xl transform overflow-hidden rounded-lg bg-white text-left align-middle shadow-xl transition-all">
            <div className="px-4 py-2 border-b flex justify-between items-center bg-primary-1">
              <h3 className="text-lg font-medium leading-6 text-white">
                Snooze Task
              </h3>

              <button type="button" onClick={closeModal}>
                <XIcon className="h-5 w-5 text-white" />
              </button>
            </div>

            <div className="px-4 py-2 space-y-4">
              <div>
                <Label>Snooze Until</Label>
                <Input
                  type="datetime-local"
                  onChangeText={setDate}
                  value={date}
                />
              </div>

              <div className="flex space-x-2 justify-end">
                <Button
                  disabled={loading || !date}
                  isLoading={loading}
                  onClick={snoozeTask}
                >
                  Snooze Task
                </Button>
                <Button color="default" onClick={closeModal}>
                  Cancel
                </Button>
              </div>
            </div>
          </Modal.Content>
        </div>
      </div>
    </Modal>
  );
};
