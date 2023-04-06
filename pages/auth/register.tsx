import { Button } from "@/components/ui/button";
import { Input, Label, FieldError } from "@/components/ui/form";
import { $http } from "@/plugins/http";
import React, { useMemo, useState } from "react";
import { useRouter } from "next/router";
import { PasswordInput } from "@/components/ui/form/PasswordInput";
import Link from "next/link";
import { NextPage } from "next";
import Head from "next/head";
import { VerifyForm } from "@/components/auth/VerifyForm";

const RegisterPage: NextPage = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [username, setUsername] = useState("");

  const [loading, setLoading] = useState(false);

  const [verifying, setVerifying] = useState(false);

  const [tosChecked, setTosChecked] = useState(false);
  const [privacyChecked, setPrivacyChecked] = useState(false);

  const toggleTos = () => setTosChecked(prev => !prev);
  const togglePrivacy = () => setPrivacyChecked(prev => !prev);

  const canRegister = useMemo(() => {
    return tosChecked && privacyChecked;
  }, [tosChecked, privacyChecked]);

  const register: React.FormEventHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await $http.post("/auth/register", {
        email,
        password,
        first_name,
        last_name,
        username
      });
      setVerifying(true);
    } catch (error) {
      // console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const handleVerifySuccess = () => {
    router.replace("/products");
  }

  return (
    <>
      <Head>
        <title key="title">Court - Register New Account</title>
      </Head>

      <div className="h-full overflow-y-auto flex flex-col bg-gray-50">
        <div className="flex-1 grid grid-cols lg:grid-cols-2">
          <div className="flex flex-col justify-center items-center lg:p-8">
            <div className="text-center text-gray-700 mb-8">
              <h2 className="text-3xl font-semibold mb-4">
                Try Court Clerk <b>FREE</b> For 30 Days
              </h2>

              <p className="max-w-md text-sm">
                Get access to all the features which will make organizing,
                sharing and managing your court case easy and simple.
              </p>
            </div>

            <img
              alt="Login Image"
              src="/images/cc_register.png"
              className="max-w-md hidden lg:block"
            />
          </div>

          <div className="bg-white flex flex-col justify-center p-8">
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

              <h1 className="text-3xl text-center text-gray-700 font-semibold mt-10">
                Create Your Account
              </h1>
            </div>
            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
              <div>
                {!verifying ? (
                  <form className="space-y-4" onSubmit={register}>
                    <div className="grid grid-cols sm:grid-cols-2 gap-2">
                      <div>
                        <Label htmlFor="name"></Label>

                        <Input placeholder="First Name" onChangeText={setFirstName} id="first_name" />

                        <FieldError name="first_name" />
                      </div>

                      <div>
                        <Label htmlFor="name"></Label>

                        <Input placeholder="Last Name" onChangeText={setLastName} id="last_name" />

                        <FieldError name="last_name" />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="email"></Label>

                      <Input placeholder="Email" onChangeText={setEmail} id="email" type="email" />

                      <FieldError name="email" />
                    </div>

                    <div>
                      <Label htmlFor="username"></Label>

                      <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-600">
                          @
                        </div>
                        <Input
                          placeholder="johndoe"
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md read-only:bg-gray-50 pl-8"
                          value={username}
                          onChangeText={setUsername}
                        />
                      </div>

                      <FieldError name="username" />
                    </div>

                    <div>
                      <Label htmlFor="password"></Label>

                      <PasswordInput placeholder="Password" autoComplete="password" onChangeText={setPassword} />

                      <FieldError name="password" />
                    </div>

                    <div>
                      <div className="space-y-4 mt-10 mb-6">
                        <label htmlFor="tos" className="flex items-center">
                          <div className="bg-white  border rounded-sm border-gray-400  w-5 h-5 flex flex-shrink-0 justify-center items-center relative">
                            <input onChange={toggleTos} checked={tosChecked} name="tos" id="tos" type="checkbox" className="cursor-pointer w-full h-full" />
                          </div>

                          <p className="ml-3 text-sm text-natural-13">
                            By Continuing you agree to our <a href="/terms-of-service" target="_blank" className="text-primary-1">Terms of Service</a>
                          </p>
                        </label>

                        <label htmlFor="privacy" className="flex items-center">
                          <div className="bg-white  border rounded-sm border-gray-400  w-5 h-5 flex flex-shrink-0 justify-center items-center relative">
                            <input onChange={togglePrivacy} checked={privacyChecked} name="privacy" id="privacy" type="checkbox" className="cursor-pointer w-full h-full" />
                          </div>

                          <p className="ml-3 text-sm text-natural-13">
                            Read our <a href="/privacy-policy" target="_blank" className="text-primary-1">Privacy Policy</a>
                          </p>
                        </label>
                      </div>
                    </div>

                    <div>
                      <Button type="submit" className="w-full py-3" isLoading={loading} disabled={loading || !canRegister}>
                        Register
                      </Button>
                    </div>

                    <div className="flex justify-center text-sm">
                      <p className="mr-2">
                        Already have an account?
                      </p>

                      <Link href="/auth/login">
                        <a className="text-indigo-600 font-medium">Login</a>
                      </Link>
                    </div>
                  </form>
                ) : (
                  <VerifyForm email={email} onVerifySuccess={handleVerifySuccess} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default RegisterPage;
