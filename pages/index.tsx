import React, { useEffect } from "react"
import { NextPageWithLayout } from "@/interfaces/page.type"
import Head from "next/head"
import { Login } from "@/components/auth/Login"
import { EagerLoad } from "@/components/fetching/EagerLoad"
import { useStore } from "effector-react"
import { $user, $userLoaded } from "@/store/auth.store"
import Router from "next/router"

const IndexPage: NextPageWithLayout = () => {
  const user = useStore($user);
  const userLoaded = useStore($userLoaded);

  useEffect(() => {
    if (userLoaded) {
      if (!!user) {
        Router.replace("/dashboard")
      }
    }
  }, [user, userLoaded]);

  return (
    <>
      <Head>
        <title key="title">MyCourtClerk - Login</title>
        <meta name="description" content="MyCourtClerk is the best solution for people who are looking for a simple, and easy way to manage their court cases. From witnesses to evidence MyCourtClerk provides you a single source of truth for everything related to your case." />
      </Head>

      <EagerLoad when={userLoaded}>
        <Login />
      </EagerLoad>
    </>
  )
}

export default IndexPage;
