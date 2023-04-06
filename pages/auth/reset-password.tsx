import React, { useState } from "react";
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { ErrorPage } from "@/components/error/ErrorPage";
import { $http } from "@/plugins/http";
import { FieldError, Form, Label, PasswordInput } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { classNames } from "@/utils/classname";
import { ChevronLeftIcon } from "@heroicons/react/outline";

interface Props {
  email: string;
  token: string;
  pageError: boolean;
}

const ResetPasswordPage: NextPage<Props> = ({ email, token, pageError }) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [doNotMatch, setDoNotMAtch] = useState(false);

  const changePassword = async () => {
    if (password !== confirmPassword) {
      setDoNotMAtch(true);
      setTimeout(() => {
        setDoNotMAtch(false);
      }, 1200);
      return;
    }
    setLoading(true);

    try {
      await $http.post("/auth/reset-password", {
        password,
        token,
        email
      });

      setSuccess(true)
    } catch (error) {

    } finally {
      setLoading(false);
    }
  }

  if (pageError) {
    return <ErrorPage />
  }

  return (
    <>
      <Head>
        <title key="title">Court - Reset Password</title>
      </Head>

      <div className="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50">
        <div className='bg-white sm:mx-auto sm:w-full sm:max-w-[380px] shadow sm:rounded-lg pt-12 pb-9 px-7'>
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
            <p className=" text-2xl font-semibold sm:leading-loose text-gray-700 text-opacity-90 mt-8 ">Reset Password </p>
            {!success && <p className=" text-sm  mb-0 pb-0 text-gray-700 text-opacity-70 ">Your new password must be different from previously used passwords</p>}
          </div>
          <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
            {success ? (
              <>
                <h3 className="text-lg leading-6 font-medium text-gray-700">Password Changed!</h3>
                <div className="mt-2 max-w-xl text-sm text-gray-500">
                  <p>
                    you can now login with your new password
                  </p>
                </div>
                <div className="mt-3 text-sm">
                  <Link href="/auth/login">
                    <a className="font-medium text-indigo-600 hover:text-indigo-500">
                      Login <span aria-hidden="true">&rarr;</span>
                    </a>
                  </Link>
                </div>
              </>
            ) : (
              <Form className="space-y-4" onSubmitPrevent={changePassword}>
                <div>
                  <Label></Label>
                  <PasswordInput onChangeText={setPassword} placeholder="New Password" />
                  <FieldError name="password" />
                </div>
                <div>
                  <Label></Label>
                  <PasswordInput onChangeText={setConfirmPassword} placeholder="Confirm Password" />
                  <FieldError name="confirmPassword" />
                </div>
                {doNotMatch && <p className='mt-4 text-sm text-red-500'>Passwords do not match!</p>}
                <div>
                  <Button type="submit" className="w-full py-3" isLoading={loading}>
                    Change Password
                  </Button>
                </div>
                <Link href="/auth/login">
                  <div className='cursor-pointer flex items-center justify-center mt-5 text-[#6200EE]'>
                    <ChevronLeftIcon width={20} height={20} color={"#6200EE"} />
                    <p>Back to login</p>
                  </div>
                </Link>
              </Form>
            )}
          </div>
        </div>

      </div>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ query, req, res }) => {
  let pageError = !query.token || !query.email;

  try {
    await $http.get("/auth/reset-password", {
      params: query
    });

  } catch (error: any) {
    pageError = true;
  }

  return {
    props: {
      email: query.email ?? null,
      token: query.token ?? null,
      pageError,
    }
  }
}

export default ResetPasswordPage;
