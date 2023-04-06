import { ModalProps } from "@/interfaces/modal.props"
import { $http } from "@/plugins/http"
import { XIcon } from "@heroicons/react/outline"
import { useState } from "react"
import { Button } from "../ui/button"
import { FieldError, Form, Input, Label, UsernameInput } from "../ui/form"
import { Modal } from "../ui/modal"

interface Props extends ModalProps {
  onSaved?: () => void
}

export const UserModalForm: React.FC<Props> = ({ isOpen, onClose, onSaved }) => {
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const [loading, setLoading] = useState(false);

  const resetState = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPassword("");
  }

  const closeModal = () => {
    resetState();

    if (onClose) {
      onClose(false);
    }
  }

  const saveUser = async () => {
    setLoading(true);

    try {
      await $http.post("/admin/users", {
        first_name,
        last_name,
        email,
        password,
        username
      });

      if (onSaved) {
        onSaved();
      }

      closeModal();
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
            <Form onSubmitPrevent={saveUser}>
              <div className="px-4 py-2 border-b flex justify-between items-center">
                <h3 className="text-lg font-medium leading-6 text-gray-700">
                  New Admin
                </h3>

                <button type="button" onClick={closeModal}>
                  <XIcon className="h-5 w-5 text-gray-600" />
                </button>
              </div>

              <div className="px-4 py-2 space-y-4">
                <div>
                  <Label>First Name</Label>
                  <Input type="text" required onChangeText={setFirstName} />

                  <FieldError name="first_name" />
                </div>

                <div>
                  <Label>Last Name</Label>
                  <Input type="text" required onChangeText={setLastName} />
                  <FieldError name="last_name"/>
                </div>

                <div>
                  <Label>UserName</Label>
                  <UsernameInput value={username} onChangeText={setUsername} />
                  <FieldError name="username"/>
                </div>

                <div>
                  <Label>Email</Label>
                  <Input type="email" required onChangeText={setEmail} />

                  <FieldError name="email" />
                </div>

                <div>
                  <Label>Password</Label>
                  <Input type="password" required onChangeText={setPassword} />

                  <FieldError name="password" />
                </div>

                <div>
                  <Button isLoading={loading} type="submit" className="w-full">
                    Save Admin
                  </Button>
                </div>
              </div>
            </Form>
          </Modal.Content>
        </div>
      </div>
    </Modal>
  )
}
