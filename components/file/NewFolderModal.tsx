import { ModalProps } from "@/interfaces/modal.props";
import { $http } from "@/plugins/http";
import { XIcon } from "@heroicons/react/outline";
import { FolderIcon } from "@heroicons/react/solid";
import React, { useRef, useState } from "react";
import { Button } from "../ui/button";
import { Input, Label } from "../ui/form";
import { Modal } from "../ui/modal";

interface Props extends ModalProps {
  isSubFolder?: boolean;
  parentFile?: any;
  onFolderCreated?: () => any
}

export const NewFolderModal: React.FC<Props> = ({parentFile, isOpen, onClose, onFolderCreated}) => {
  const [name, setName] = useState("Untitled Folder");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();

  const inputRef = useRef(null);

  const closeModal = () => {
    if (onClose) {
      onClose(false)
    }
  }

  const addFolder = async() => {
    setLoading(true);

    try {
      await $http.post("/files", {
        folder_name: name,
        file_id: parentFile,
        type: "folder"
      });

      setName("");
      setErrorMessage(undefined)

      if (onFolderCreated) {
        onFolderCreated();
      }
    } catch (err: any) {
      if (err?.response.status == 400) {
        setErrorMessage(err?.response.data.message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={closeModal} initialFocus={inputRef}>
      <Modal.Backdrop />

      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center">
          <Modal.Content className="w-full max-w-md transform overflow-hidden rounded-lg bg-white text-left align-middle shadow-xl transition-all">
            <div className="px-6 py-4 border-b flex justify-between items-center">
              <div className="flex items-center">
                <FolderIcon className="h-7 w-7 text-gray-400 mr-2" />

                <h3 className="text-lg font-medium leading-6 text-gray-700">
                  Create Folder
                </h3>
              </div>

              <button type="button" onClick={closeModal}>
                <XIcon className="h-5 w-5 text-gray-600" />
              </button>
            </div>

            <div className="px-6 py-4 space-y-4">
              <div>
                <Label>Folder Name</Label>
                <Input onChangeText={setName} value={name} ref={inputRef}/>

                {!!errorMessage && (
                  <span className="block mt-1 text-red-500 text-xs">
                    {errorMessage}
                  </span>
                )}
              </div>

              <div className="flex space-x-2">
                <Button isLoading={loading} onClick={addFolder} disabled={!name || loading} className="min-w-[100px]">
                  Create
                </Button>

                <Button onClick={closeModal} color="default">Cancel</Button>
              </div>
            </div>
          </Modal.Content>
        </div>
      </div>
    </Modal>
  )
}

NewFolderModal.defaultProps = {
  isSubFolder: false,
  isOpen: false,
}
