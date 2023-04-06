import { useAuth } from "@/hooks/auth.hook";
import { $http } from "@/plugins/http";
import { useAuthReducer } from "@/reducers/auth.reducer"
import { useRouter } from "next/router";
import React from "react";
import { useState } from "react";
import { Button } from "../ui/button"
import { FieldError, Form, Input, Label } from "../ui/form"
import { PasswordInput } from "../ui/form/PasswordInput";

// will refactor this component later
export const AccountRegistration: React.FC<{ email: string }> = ({ email }) => {
  const router = useRouter();

  const { verify } = useAuth();

  const [state, dispatch] = useAuthReducer();

  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [otpCode, setOtpCode] = useState<string>();

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    dispatch(e.target.name, e.target.value)
  }

  const register: React.FormEventHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await $http.post(`/party-invitations/${router.query.path}/register`, {
        ...state,
        email,
      });
      setVerifying(true);
    } catch (error) {
      // console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const handleVerify = async () => {
    setLoading(true);

    try {
      await verify({ email, code: otpCode as string });

      router.replace(`/dashboard`);
    } catch (error) {
      setLoading(false)
    }
  }

  return (
    <Form className="space-y-4" onSubmitPrevent={verifying ? handleVerify : register}>
      {!verifying ? (
        <>
          <div className="grid grid-cols lg:grid-cols-2 gap-4">
            <div>
              <Label>First Name</Label>
              <Input name="first_name" value={state.first_name} placeholder="First Name" onChange={handleChange} />

              <FieldError name="first_name" />
            </div>

            <div>
              <Label>Last Name</Label>
              <Input name="last_name" value={state.last_name} placeholder="Last Name" onChange={handleChange} />

              <FieldError name="last_name" />
            </div>
          </div>

          <div>
            <Label>Email</Label>
            <Input name="email" value={email} type="email" placeholder="email@example.com" readOnly />

            <FieldError name="email" />
          </div>

          <div>
            <Label htmlFor="username">Username</Label>

            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-600">
                @
              </div>
              <Input
                placeholder="johndoe"
                name="username"
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md read-only:bg-gray-50 pl-8"
                value={state.username}
                onChange={handleChange}
              />
            </div>

            <FieldError name="username" />
          </div>

          <div>
            <Label>Password</Label>
            <PasswordInput name="password" onChange={handleChange} />

            <FieldError name="password" />
          </div>
        </>
      ) : (
        <div>
          <Input placeholder="OTP" onChangeText={setOtpCode} />
        </div>
      )}

      <div>
        <Button type="submit" isLoading={loading} className="w-full">
          {verifying ? "Verify Account" : "Register Account"}
        </Button>
      </div>
    </Form>
  )
}
