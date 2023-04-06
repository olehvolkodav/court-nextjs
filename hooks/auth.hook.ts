import Cookies from "js-cookie";
import { $gql, $http } from "@/plugins/http";
import { $date } from "@/plugins/date";
import { AUTH_USER_QUERY } from "@/graphql/query/user";
import { setUser } from "@/store/auth.store";
import { useCallback } from "react";

interface VerifyOptions {
  email: string;
  code: string;
}

export const useAuth = () => {
  const verify = async(options: VerifyOptions) => {
    const { email, code } = options;

    const res = await $http.post("/auth/verify", {email, code});

    Cookies.set("court_auth_token", res.data.token, {expires: $date().add(1, "year").toDate()});

    const {me} = await $gql(AUTH_USER_QUERY);
    setUser(me);

    return res.data;
  }

  const refetch = useCallback(async() => {
    try {
      const {me} = await $gql(AUTH_USER_QUERY);
      setUser(me);

      return me;
    } catch (error) {
      return Promise.reject(error)
    }
  }, []);

  const logout = useCallback(async() => {
    try {
      await $http.post("/auth/logout");
      Cookies.remove("court_auth_token");
      setUser(null)

      return true;
    } catch (error) {
      return Promise.reject(error)
    }
  }, []);

  return {
    verify,
    refetch,
    logout,
  }
}
