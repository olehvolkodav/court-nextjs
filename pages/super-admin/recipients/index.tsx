import { RecipientModal } from "@/components/super-admin/recipient/RecipientModal";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/button";
import { PaginationTable } from "@/components/ui/pagination";
import { PAGINATION_FIELD, PAGINATION_PARAMS, PAGINATION_VARS, parsePage } from "@/graphql/query/util";
import { withAdminLayout } from "@/hoc/layout";
import { NextPageWithLayout } from "@/interfaces/page.type";
import { $gql } from "@/plugins/http";
import { paginationInitialState, paginationReducer } from "@/reducers/pagination.reducer";
import { useRouter } from "next/router";
import { useCallback, useEffect, useReducer, useState } from "react";

const RECIPIENTS_QUERY = `
  query(${PAGINATION_PARAMS}) {
    recipients(${PAGINATION_VARS}) {
      data {
        id
        name
        email
        tags_count
        user {
          id
        }
      }
      ${PAGINATION_FIELD}
    }
  }
`

const RecipientsPage: NextPageWithLayout = () => {
  const router = useRouter();
  const [pagination, dispatch] = useReducer(paginationReducer, paginationInitialState);

  const [recipients, setRecipients] = useState<any[]>([]);
  const [recipientModalOpen, setRecipientModalOpen] = useState(false);

  const createRecipient = () => setRecipientModalOpen(true);

  const handleRecipientAdded = (recipient: any) => {
    setRecipientModalOpen(false);

    getRecipients()
  }

  const getRecipients = useCallback(async() => {
    const page = parsePage(router.query.page)

    try {
      const data = await $gql({
        query: RECIPIENTS_QUERY,
        variables: { page }
      });

      setRecipients(data.recipients.data);
      dispatch({
        type: "set",
        value: data.recipients.paginatorInfo,
      })
    } catch (error) {

    }
  }, [router.query.page])

  useEffect(() => {
    getRecipients();
  }, [getRecipients]);

  return (
    <>
      <div className="py-4">
        <div className="container px-4 mx-auto">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-700">Recipients</h1>

            <div>
              <Button onClick={createRecipient}>
                + New Recipient
              </Button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="x-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Subscribed</th>
                  <th>Total Tags</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {recipients.map(recipient => (
                  <tr key={recipient.id}>
                    <td className="flex items-center space-x-1">
                      <span>{recipient.name}</span>
                      {!!recipient.user && (
                        <Badge size="xs" color="primary">
                          User
                        </Badge>
                      )}
                    </td>
                    <td>{recipient.email}</td>
                    <td>Yes</td>
                    <td>{recipient.tags_count}</td>
                    <td></td>
                  </tr>
                ))}
              </tbody>
            </table>

            <PaginationTable data={pagination} />
          </div>
        </div>
      </div>

      <RecipientModal
        isOpen={recipientModalOpen}
        onClose={setRecipientModalOpen}
        onRecipientAdded={handleRecipientAdded}
      />
    </>
  )
}

export default withAdminLayout(RecipientsPage, "Court - Recipients")