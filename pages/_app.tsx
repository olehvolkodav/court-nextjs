import "../styles/globals.css"
import Head from "next/head"
import React from "react";
import { setUser, setUserLoaded } from "@/store/auth.store";
import Cookies from "js-cookie";
import { $gql } from "@/plugins/http";
import Router, { useRouter } from "next/router";
import { $errorActions } from "@/store/error.store";
import { ToastContainer } from "@/components/ui/toast/ToastContainer";
import { AUTH_USER_QUERY } from "@/graphql/query/user";
import { useApollo } from "@/lib/apollo-client";
import { ApolloProvider } from "@apollo/client";
import { AppPropsWithLayout } from "@/interfaces/page.type";
import { SessionProvider } from "next-auth/react";

function MyApp({
  Component,
  pageProps: { session, ...pageProps },
}: AppPropsWithLayout) {
  const apolloClient = useApollo(pageProps);

  const router = useRouter();

  const getLayout = Component.getLayout ?? ((page) => page);

  React.useEffect(() => {
    const getAuthUser = async() => {
      const token = Cookies.get("court_auth_token");

      if (!!token) {
        try {
          const {me} = await $gql(AUTH_USER_QUERY);

          if (!me) {
            await Router.replace("/");
            return Cookies.remove("court_auth_token");
          }

          setUser(me)
        } catch (error) {
          return Cookies.remove("court_auth_token");
        }
      }
    }

    getAuthUser().finally(() => setUserLoaded(true));
  }, []);

  React.useEffect(() => {
    const clearErrorState = () => {
      $errorActions.setErrors({});
    }

    router.events.on("routeChangeComplete", clearErrorState);

    return () => {
      router.events.off("routeChangeComplete", clearErrorState);
    }
  }, [router])

  return (
    <>
      <Head>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <title key="title">Court</title>
      </Head>

      <SessionProvider session={session}>
        <ApolloProvider client={apolloClient}>
          {getLayout(<Component {...pageProps} />)}
        </ApolloProvider>
      </SessionProvider>

      <ToastContainer />
    </>
  )
}

export default MyApp
