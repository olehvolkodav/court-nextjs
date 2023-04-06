import { Button } from "@/components/ui/button";
import { Input, FieldError, Form, PasswordInput } from "@/components/ui/form";
import { $http } from "@/plugins/http";
import React, { useMemo, useState } from "react";
import { useRouter } from "next/router";
import { useToast } from "@/hooks/toast.hook";
import Link from "next/link";
import { ResetPasswordModal } from "@/components/auth/ResetPasswordModal";
import { VerifyForm } from "@/components/auth/VerifyForm";
import { OAuthButtons } from "@/components/auth/OAuthButtons";

export const Login: React.FC = () => {
  const toast = useToast();

  const router = useRouter();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const [verifying, setVerifying] = useState(false);

  const [resetModalOpen, setResetModalOpen] = useState(false);

  const login: React.FormEventHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await $http.post("/auth/login", { email, password });
      setVerifying(true);
    } catch (err: any) {
      if (err?.response.status == 400) {
        toast.show({
          message: err?.response.data.message ?? "This credentials do not match our record"
        })
      }
    } finally {
      setLoading(false)
    }
  }

  const showResetModal = () => setResetModalOpen(true);

  const toDashboard = () => {
    router.replace("/dashboard");
  }

  return (
    <>
      <div className="h-full overflow-y-auto flex flex-col bg-gray-50">
        <div className="flex-1 grid grid-cols lg:grid-cols-2">
          <div className="hidden lg:flex justify-center items-center p-8">
            <img
              alt="Login Image"
              src="/images/cc_login.png"
              className="max-w-md"
            />
          </div>

          <div className="bg-white flex flex-col justify-center p-6 lg:p-8">
            <div className="sm:mx-auto sm:w-full">
              <Link href="/">
                <a>
                  <img
                    className="mx-auto w-full max-w-xs"
                    src="/logo.png"
                    alt="MyCourtClerk Logo"
                  />
                </a>
              </Link>
              <h1 className="text-3xl sm:leading-loose text-gray-700 text-opacity-90 mt-8 text-center font-semibold">
                Sign In To Your Account
              </h1>
            </div>

            <div className="mt-6 w-full lg:max-w-md mx-auto">
              <div className="bg-white ">
                {!verifying ? (
                  <Form onSubmitPrevent={login}>
                    <div className="space-y-4">
                      <div>
                        <Input onChangeText={setEmail} id="email" type="email" placeholder="Email" />
                        <FieldError name="email" />
                      </div>
                      <div>
                        <PasswordInput onChangeText={setPassword} type="password" autoComplete="password" placeholder="Password" />
                        <FieldError name="password" />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="py-4 flex items-center">
                          <div className="bg-white  border rounded-sm border-gray-400  w-5 h-5 flex flex-shrink-0 justify-center items-center relative">
                            <input type="checkbox" className="cursor-pointer w-full h-full" />
                          </div>
                          <p className="ml-3 text-sm leading-tight text-gray-700 text-opacity-90">Remember Me</p>
                        </div>
                        <div className="text-sm">
                          <button onClick={showResetModal} type="button" className="font-medium text-indigo-600 hover:text-indigo-500">
                            Forgot your password?
                          </button>
                        </div>
                      </div>

                      <div>
                        <Button type="submit" className="w-full py-3" isLoading={loading}>
                          LOGIN
                        </Button>
                      </div>

                      <div className="mt-6">
                        <div className="relative mb-4">
                          <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300" />
                          </div>
                          <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">Or</span>
                          </div>
                        </div>

                        <OAuthButtons />
                      </div>
                    </div>

                    <div className="flex text-sm justify-center mt-10">
                      <p className="text-base leading-normal text-center text-gray-500 mr-2">
                        New on our platform? <Link href="/auth/register">
                          <a className="text-indigo-700 text-base leading-normal text-center font-medium hover:underline">Create an account</a>
                        </Link>
                      </p>
                    </div>
                  </Form>
                ) : (
                  <VerifyForm email={email} onVerifySuccess={toDashboard} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <ResetPasswordModal isOpen={resetModalOpen} onClose={setResetModalOpen} />
    </>
  )
}
