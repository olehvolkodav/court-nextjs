import React, { useState } from "react";
import { ModalProps } from "@/interfaces/modal.props";
import { Modal } from "../ui/modal";
import { FieldError, Input, Label } from "../ui/form";
import { Button } from "../ui/button";
import { $http } from "@/plugins/http";
import { $errorActions } from "@/store/error.store";
import { useToast } from "@/hooks/toast.hook";
import { ChevronLeftIcon, XIcon } from "@heroicons/react/outline";
import Link from "next/link";

export const ResetPasswordModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const toast = useToast();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const closeModal = () => {
    setEmail("");
    $errorActions.setErrors({});

    if (onClose) {
      onClose(false)
    }
  }

  const sendResetPassword = async () => {
    setLoading(true);

    try {
      await $http.post("/auth/reset-password-link", { email });

      toast.show({
        message: "Reset password link has been sent to your email."
      })

      closeModal();
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
            <div className='sm:mx-auto sm:w-full sm:max-w-[380px] sm:rounded-lg pt-12 pb-9 px-7'>
              <div className="sm:mx-auto sm:w-full ">
                <Link href="/">
                  <a>
                    <img
                      className="mx-auto h-8 w-full max-w-[193px]"
                      src="/logo.png"
                      alt="MyCourtClerk Logo"
                    />
                  </a>
                </Link>
                <p className="text-2xl font-semibold sm:leading-loose text-gray-700 text-opacity-90 mt-8 ">Forgot Password? </p>
                <p className="text-sm  mb-0 pb-0 text-gray-700 text-opacity-70 ">Enter your email and we will send you instructions to reset your password</p>
              </div>
              <div className="mt-6 space-y-4">
                <div>
                  <Label></Label>
                  <Input type="email" placeholder='Email' required onChangeText={setEmail} />
                  <FieldError name="email" />
                </div>

                <div>
                  <Button isLoading={loading} onClick={sendResetPassword} className="w-full py-3" disabled={!email || loading}>Send Password Reset Link</Button>
                </div>
                <div onClick={closeModal}>
                  <div className='cursor-pointer flex items-center justify-center mt-5 text-[#6200EE]'>
                    <ChevronLeftIcon width={20} height={20} color={"#6200EE"} />
                    <p>Back to login</p>
                  </div>
                </div>
              </div>
            </div>

          </Modal.Content>
        </div>
      </div>
    </Modal>
  )
}

ResetPasswordModal.defaultProps = {
  isOpen: false,
}
