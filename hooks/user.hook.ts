import { $user, $userLoaded } from "@/store/auth.store"
import { useStore } from "effector-react";
import Router from "next/router";
import { useEffect } from "react";

export const useCurrentUser = (middleware?: "auth" | "guest", redirect?: string) => {
  const user = useStore($user);
  const isLoaded = useStore($userLoaded);

  useEffect(() => {
    if (isLoaded) {
      // if (middleware === 'guest' && redirect && user) {
      //   Router.replace(redirect)
      // }
      if (middleware === "auth" && !user && redirect) {
        Router.replace(redirect)
      }
    }
  }, [user, isLoaded, redirect, middleware])

  return { user, isLoaded };
}
