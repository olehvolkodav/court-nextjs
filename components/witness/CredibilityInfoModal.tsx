import { ModalProps } from "@/interfaces/modal.props";
import { Button } from "../ui/button";
import { Modal } from "../ui/modal";

export const CredibilityInfoModal: React.FC<ModalProps> = ({isOpen, onClose}) => {
  const handleClose = () => {
    if (onClose) {
      onClose(false);
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Backdrop />

      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center">
          <Modal.Content>
            <div className="px-4 py-2">
              <h5 className="text-xl font-medium">
                Credibility
              </h5>

              <p className="text-sm text-gray-700 mb-2">
                List out any issues the other side may bring up about this witness and their credibility to the case.
                For example: Are any past criminal records, is this witness biased or any other possible issues which we need to address?
              </p>

              <Button onClick={handleClose}>
                Close
              </Button>
            </div>
          </Modal.Content>
        </div>
      </div>
    </Modal>
  )
}
