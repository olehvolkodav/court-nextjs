import { useToast } from "@/hooks/toast.hook";
import { ModalProps } from "@/interfaces/modal.props";
import { $http } from "@/plugins/http";
import { useState } from "react";
import { Button } from "../ui/button";
import { FieldError, Input, Label } from "../ui/form";
import { Modal } from "../ui/modal";

interface Props extends ModalProps {
  /** File Or Folder */
  file: any;
  onAdded?: () => void
}

export const FileShareModal: React.FC<Props> = ({isOpen, onClose, file, onAdded}) => {
  const toast = useToast();

  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(false);

  const closeModal = () => {
    if (onClose) {
      onClose(false)
    }

    setEmail("")
  }

  const shareFile = async() => {
    setLoading(true);

    try {
      await $http.post("/share-files", {
        email,
        file_id: file.id,
        access: "read"
      });

      toast.show({message: "File shared successfully"});

      setEmail("");

      if (onAdded) {
        onAdded()
      }
    } catch {

    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={closeModal}>
      <Modal.Backdrop />

      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center">
          <Modal.Content className="w-full max-w-lg transform overflow-hidden rounded-lg bg-white text-left align-middle shadow-xl transition-all">
            <div className="px-4 py-2">
              <h3 className="text-lg font-natural-13 font-medium">Share With</h3>
            </div>

            <div className="px-4 py-2 space-y-4">
              <div>
                <Label>Email</Label>
                <Input type="email" onChangeText={setEmail} value={email} />

                <FieldError name="email" />
              </div>

              <div>
                <p className="text-xs text-gray-600">
                  An invitation will be sent if they do not have a MyCourtClerk account.
                </p>
              </div>

              <div className="flex space-x-2">
                <Button className="min-w-[100px]" onClick={shareFile} isLoading={loading} disabled={loading || !email}>
                  Share
                </Button>

                <Button color="default" onClick={closeModal}>Cancel</Button>
              </div>
            </div>
          </Modal.Content>
        </div>
      </div>
    </Modal>
  )
}
