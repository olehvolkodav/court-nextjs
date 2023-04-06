import { Loading } from "@/components/ui/loading";
import { $gql, $http } from "@/plugins/http";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { ErrorPage } from "@/components/error/ErrorPage";
import { signOut } from "next-auth/react";
import Cookies from "js-cookie";
import { $date } from "@/plugins/date";
import { AUTH_USER_QUERY } from "@/graphql/query/user";
import { setUser } from "@/store/auth.store";
import Router from "next/router";

export default function CallbackPage() {
  const session = useSession();

  useEffect(() => {
    const authenticateUser = async() => {
      try {
        const res = await $http.post("/auth/social", {
          provider: session.data?.provider,
          token: session.data?.accessToken,
        });

        Cookies.set("court_auth_token", res.data.token, {
          expires: $date().add(1, "year").toDate()
        });

        const { me } = await $gql(AUTH_USER_QUERY);
        setUser(me);

        Router.replace("/dashboard");
      } catch (error) {

      }
    }

    if (session.status === "authenticated") {
      authenticateUser();

      return () => {
        signOut({redirect: false})
      }
    }
  }, [session])

  if (session.status === "unauthenticated") {
    return (
      <ErrorPage
        statusCode={401}
        title="Invalid Session"
        message="Your session is invalid"
      />
    )
  }

  return (
    <div className="min-h-screen flex justify-center items-center flex-col">
      <h2>Validating Social Provider</h2>
      <Loading />
    </div>
  )
}
