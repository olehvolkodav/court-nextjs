import { InvitationRegistration } from "@/components/invitation/InvitationRegistration";
import { Button } from "@/components/ui/button";
import { MenuLink } from "@/components/ui/link";
import { FullscreenLoading } from "@/components/ui/loading";
import { useCurrentUser } from "@/hooks/user.hook";
import { $gql, $http } from "@/plugins/http";
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Router from "next/router";
import { useState } from "react";

const InvitationDetailPage: NextPage<{ invitation: any }> = ({ invitation }) => {
  const [accept, setAccept] = useState(false);
  const { user, isLoaded } = useCurrentUser();
  const [registering, setRegistering] = useState(false);
  const [loading, setLoading] = useState(false);

  const acceptInvitation = async() => {
    setLoading(true);

    try {
      await $http.patch(`/invitations/${invitation.id}`, {
        accept: true,
      });

      if (!!user) {
        return Router.replace(`/dashboard`)
      }

      setAccept(true);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  }

  const prepareRegistration = () => setRegistering(true);

  return (
    <>
      <Head>
        <title key="title">Court - Invitation</title>
      </Head>

      {!isLoaded && <FullscreenLoading />}

      {isLoaded && (
        <div className="bg-gray-50 min-h-screen flex flex-col justify-center items-center">
          <div className="w-full max-w-lg bg-white shadow rounded-lg px-4 py-4 lg:px-6">
            {/* Accepted state only work when user is not logged in */}
            {accept ? (
              <div>
                <h3 className="font-medium text-gray-800 text-lg">Invitation Accepted</h3>
                <p className="text-gray-700 mb-4">login to continue</p>
                <MenuLink href="/auth/login" className="inline-flex text-white bg-indigo-600 px-4 py-2 rounded-lg">
                  Login
                </MenuLink>
              </div>
            ) : (
              !registering ? (
                <>
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Hello {invitation.email}</h3>

                  <div className="mt-2 max-w-xl text-sm text-gray-500">
                    <p>
                      You are invited to view <b>{invitation.caller.name}</b> file/folder
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
                <InvitationRegistration email={invitation.email} />
              )
            )}
          </div>
        </div>
      )}
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ query, req }) => {
  // if we do this much we may move it to _middleware
  if (!!req.cookies.court_auth_token) {
    $http.defaults.headers.common.Authorization = `Bearer ${req.cookies.court_auth_token}`
  }

  try {
    const { invitation } = await $gql({
      query: `
        query($id: ID!) {
          invitation(id: $id) {
            id
            email
            status
            user_id
            caller {
              name
            }
          }
        }
      `,
      variables: {
        id: query.id,
      }
    })

    return {
      props: {
        invitation,
      },
      notFound: invitation.status !== "pending"
    }
  } catch (error) {
    return {
      notFound: true,
    }
  }
}

export default InvitationDetailPage;
