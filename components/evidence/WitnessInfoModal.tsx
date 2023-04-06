import { ModalProps } from "@/interfaces/modal.props";
import { Button } from "../ui/button";
import { Modal } from "../ui/modal";

export const WitnessInfoModal: React.FC<ModalProps> = ({isOpen, onClose}) => {
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
              <h5 className="font-medium text-xl">Adding Witness</h5>

              <p className="text-sm text-gray-700 mb-2">
                By adding this witness they may be contacted to provided additional statements and or documentation for the case.
              </p>

              <Button onClick={handleClose}>Close</Button>
            </div>
          </Modal.Content>
        </div>
      </div>
    </Modal>
  )
}
