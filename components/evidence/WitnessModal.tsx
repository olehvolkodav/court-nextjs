import { ModalProps } from "@/interfaces/modal.props";
import { $http } from "@/plugins/http";
import React from "react";
import { Modal } from "../ui/modal";
import { WitnessForm } from "../witness/WitnessForm";

interface IWitnessModalProps extends ModalProps {
  onWitnessAdded?: (witness: any) => any;
}

export const WitnessModal: React.FC<IWitnessModalProps> = ({isOpen, onClose, onWitnessAdded}) => {
  const [loading, setLoading] = React.useState(false);

  const saveWitness = async(payload: any) => {
    setLoading(true);

    try {
      const { data } = await $http.post("/witnesses", payload);

      if (onWitnessAdded) {
        onWitnessAdded(data.witness);
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
          <Modal.Content
            className="w-full max-w-screen-lg transform overflow-hidden rounded-lg bg-white text-left align-middle shadow-xl transition-all"
          >
            <WitnessForm onSubmit={saveWitness} loading={loading} />
          </Modal.Content>
        </div>
      </div>
    </Modal>
  )
}
