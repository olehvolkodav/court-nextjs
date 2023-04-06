import type { NextPage, GetServerSideProps } from "next";
import React, { useState } from "react";
import { ErrorProps } from "@/interfaces/react.props";
import { $gql, $http } from "@/plugins/http";
import { ErrorPage } from "@/components/error/ErrorPage";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";
import { useCurrentUser } from "@/hooks/user.hook";
import { AccountRegistration } from "@/components/party-invitation/AccountRegistration";
import { MenuLink } from "@/components/ui/link";
import { FullscreenLoading } from "@/components/ui/loading/FullscreenLoading";

const FIND_PARTY_INVITATION_QUERY = `
  query($path: String!) {
    party_invitation(path: $path) {
      id
      email
      user_id
      path
      role
      status
      court_case {
        id
        name
      }
    }
  }
`

type Props = ErrorProps & {invitation: any};

const PartyInvitationPage: NextPage<Props> = ({pageError, invitation}) => {
  const router = useRouter();
  const { user, isLoaded } = useCurrentUser();

  const [loading, setLoading] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [accept, setAccept] = useState(false);

  const prepareRegistration = () => setRegistering(true);

  const acceptInvitation = async() => {
    setLoading(true);

    try {
      await $http.patch(`/party-invitations/${invitation.path}`, {
        accept: true,
      });

      if (!!user) {
        return router.replace(`/dashboard/${invitation.court_case.id}`)
      }

      setAccept(true);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  }

  if (pageError || user?.id) {
    return <ErrorPage />
  }

  if (!isLoaded) {
    return <FullscreenLoading />
  }

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col justify-center items-center">
      <div className="w-full max-w-lg bg-white shadow rounded-lg px-4 py-4 lg:px-6">
        {/* Accepted state only work when user is not logged in */}
        {accept ? (
          <div>
            <h3 className="font-medium text-gray-800 text-lg">Invitation Accepted</h3>
            <p className="text-gray-700 mb-4">login and check your cases dashboard</p>
            <MenuLink href="/auth/login" className="inline-flex text-white bg-indigo-600 px-4 py-2 rounded-lg">
              Login
            </MenuLink>
          </div>
        ): (
          !registering ? (
            <>
              <h3 className="text-lg leading-6 font-medium text-gray-900">Hello {invitation.name}</h3>

              <div className="mt-2 max-w-xl text-sm text-gray-500">
                <p>
                  you are invited as a <b className="capitalize">{invitation.role}</b> in <b>{invitation.court_case.name}</b> case.
                </p>
                {!invitation.user_id && (
                  <p>
                    but you dont seem to have a CourtClerk account yet, create an account and accept the invitation request by pressing the button below
                  </p>
                )}
              </div>
              <div className="mt-5">
                <Button isLoading={loading} onClick={invitation.user_id ? acceptInvitation : prepareRegistration}>
                  {invitation.user_id ? "Accept Invitation" : "Register New Account"}
                </Button>
              </div>
            </>
          ) : (
            <AccountRegistration email={invitation.email} />
          )
        )}
      </div>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async({query, req}) => {
  const props = { errorCode: 404, pageError: false, invitation: null as any };

  // if we do this much we may move it to _middleware
  if (!!req.cookies.court_auth_token) {
    $http.defaults.headers.common.Authorization = `Bearer ${req.cookies.court_auth_token}`
  }

  try {
    const {party_invitation} = await $gql({
      query: FIND_PARTY_INVITATION_QUERY,
      variables: {
        path: query.path,
      }
    });

    if (!party_invitation || ["accepted", "rejected"].includes(party_invitation?.status)) {
      props.pageError = true;
    }

    props.invitation = party_invitation;
  } catch (error) {
    console.log(error)
    props.pageError = true;
  }

  return {props}
}

export default PartyInvitationPage;
