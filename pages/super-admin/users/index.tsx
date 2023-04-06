import React, { useCallback, useReducer, useState } from "react"
import { useRouter } from "next/router";
import { $gql } from "@/plugins/http";
import { paginationInitialState, paginationReducer } from "@/reducers/pagination.reducer";
import { Pagination } from "@/components/ui/pagination/Pagination";
import { PAGINATION_FIELD } from "@/graphql/query/util";
import { withAdminLayout } from "@/hoc/layout";
import { $date } from "@/plugins/date";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/button";
import { UserModalForm } from "@/components/user/UserModalForm";

const USERS_QUERY = `
  query($first: Int, $page: Int) {
    users: admin_users(first: $first, page: $page) {
      ${PAGINATION_FIELD}
      data {
        id
        name
        email
        created_at
        is_admin
      }
    }
  }
`

const UsersPage: React.FC = () => {
  const router = useRouter();
  const [pagination, dispatch] = useReducer(paginationReducer, paginationInitialState);

  const [users, setUsers] = useState<any[]>([]);

  const [userModalOpen, setUserModalOpen] = useState(false);

  const openUserModal = () => setUserModalOpen(true);

  const getUsers = useCallback(async() => {
    const page = parseInt(router.query?.page as string) || 1;

    try {
      const data = await $gql({
        query: USERS_QUERY,
        variables: { page }
      });

      setUsers(data.users.data);
      dispatch({type: "set", value: data.users.paginatorInfo});
    } catch (error) {
    }
  }, [router.query?.page]);

  React.useEffect(() => {
    getUsers();
  }, [getUsers]);

  return (
    <div className="py-4">
      <div className="container px-4 mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold text-gray-900">Users</h1>

          <Button onClick={openUserModal}>
            Add Admin +
          </Button>
        </div>

        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <table className="x-table">
            <thead className="bg-gray-50">
              <tr>
                <th>Created</th>
                <th>Name</th>
                <th>Email Address</th>
                <th></th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {users.map((user) => (
                <tr key={user.id}>
                  <td>
                    {$date(user.created_at).format("MMM DD, YYYY")}
                  </td>
                  <td>
                    {user.name}
                  </td>
                  <td>
                    {user.email}
                  </td>
                  <td>
                    {user.is_admin && (
                      <Badge>Admin</Badge>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <Pagination data={pagination} className="px-4 py-2 border-t" />
        </div>
      </div>

      <UserModalForm isOpen={userModalOpen} onClose={setUserModalOpen} onSaved={getUsers} />
    </div>
  )
}

export default withAdminLayout(UsersPage);
