import React from "react";
import { NextPage } from "next";
import Head from "next/head";
import { Login } from "@/components/auth/Login";

const LoginPage: NextPage = () => {
  return (
    <>
      <Head>
        <title key="title">MyCourtClerk - Login</title>
      </Head>

      <Login />
    </>
  )
}

export default LoginPage;
