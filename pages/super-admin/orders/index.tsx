import { useEffect, useReducer, useState } from "react";
import { withAdminLayout } from "@/hoc/layout";
import { NextPageWithLayout } from "@/interfaces/page.type";
import { PAGINATION_FIELD, PAGINATION_PARAMS, PAGINATION_VARS, parsePage } from "@/graphql/query/util";
import { $gql } from "@/plugins/http";
import { formatPrice } from "@/utils/mix";
import { Badge } from "@/components/ui/Badge";
import { paginationInitialState, paginationReducer } from "@/reducers/pagination.reducer";
import { useRouter } from "next/router";
import { PaginationTable } from "@/components/ui/pagination";

const ORDERS_QUERY = `
  query(${PAGINATION_PARAMS}) {
    orders: admin_orders(${PAGINATION_VARS}) {
      data {
        id
        status
        product {
          name
        }
        price
        user {
          name
        }
      }
      ${PAGINATION_FIELD}
    }
  }
`

const OrdersPage: NextPageWithLayout = () => {
  const router = useRouter();
  const [pagination, dispatch] = useReducer(paginationReducer, paginationInitialState)

  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    const page = parsePage(router.query.page);

    const getOrders = async() => {
      try {
        const data = await $gql({
          query: ORDERS_QUERY,
          variables: { page }
        });

        setOrders(data.orders.data);
        dispatch({
          type: "set",
          value: data.orders.paginatorInfo
        })
      } catch (error) {

      }
    }

    getOrders();
  }, [router.query.page])

  return (
    <div className="py-4">
      <div className="container px-4 mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-700">Orders</h1>

          {/* <div>
            Filters Here
          </div> */}
        </div>

        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <table className="x-table">
            <thead className="bg-gray-50">
              <tr>
                <th>User</th>
                <th>Product</th>
                <th>Price</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {orders.map(order => (
                <tr key={order.id}>
                  <td>{order.user.name}</td>
                  <td>{order.product.name}</td>
                  <td>${formatPrice(order.price)}</td>
                  <td>
                    <Badge className="capitalize">
                      {order.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <PaginationTable data={pagination} />
        </div>
      </div>
    </div>
  )
}

export default withAdminLayout(OrdersPage, "Court - Orders");
