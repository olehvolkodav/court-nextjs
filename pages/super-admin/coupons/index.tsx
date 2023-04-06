import { Badge } from "@/components/ui/Badge";
import { Pagination } from "@/components/ui/pagination";
import { PAGINATION_FIELD, PAGINATION_PARAMS, PAGINATION_VARS, parsePage } from "@/graphql/query/util";
import { withAdminLayout } from "@/hoc/layout";
import { NextPageWithLayout } from "@/interfaces/page.type";
import { $gql } from "@/plugins/http";
import { paginationInitialState, paginationReducer } from "@/reducers/pagination.reducer";
import { $theme } from "@/theme";
import { classNames } from "@/utils/classname";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useReducer, useState } from "react";

const COUPONS_QUERY = `
  query(${PAGINATION_PARAMS}) {
    coupons(${PAGINATION_VARS}) {
      ${PAGINATION_FIELD}
      data {
        id
        name
        code
        terms
        times_redeemed
      }
    }
  }
`

const CouponsPage: NextPageWithLayout = () => {
  const router = useRouter();

  const [coupons, setCoupons] = useState<any[]>([])
  const [pagination, dispatch] = useReducer(paginationReducer, paginationInitialState);

  useEffect(() => {
    const getCoupons = async() => {
      const page = parsePage(router.query.page);

      try {
        const data = await $gql({
          query: COUPONS_QUERY,
          variables: {
            page,
          }
        });

        dispatch({
          type: "set",
          value: data.coupons.paginatorInfo,
        });

        setCoupons(data.coupons.data)
      } catch (error) {

      }
    }

    getCoupons();
  }, [router.query.page]);

  return (
    <div className="py-4">
      <div className="container px-4 mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-natural-13">Coupons</h1>

          <Link href="/super-admin/coupons/create">
            <a className={classNames($theme.button(), "min-w-[80px]")}>
              Add +
            </a>
          </Link>
        </div>

        <div className="bg-white overflow-hidden rounded-md">
          <table className="x-2-table overflow-x-auto">
            <thead>
              <tr>
                <th>Coupon</th>
                <th>Code</th>
                <th>Terms</th>
                <th>Redemptions</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {coupons.map(coupon => (
                <tr key={coupon.id}>
                  <td>{coupon.name}</td>
                  <td>
                    <Badge>
                      {coupon.code}
                    </Badge>
                  </td>
                  <td>{coupon.terms}</td>
                  <td>{coupon.times_redeemed}</td>
                  <td></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Pagination data={pagination} className="mt-4" />
      </div>
    </div>
  )
}

export default withAdminLayout(CouponsPage, "Court - Coupons");
