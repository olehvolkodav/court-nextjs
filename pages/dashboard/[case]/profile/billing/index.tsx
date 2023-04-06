
import React, { useState } from "react";
import { NextPageWithLayout } from "@/interfaces/page.type";
import { DashboardLayout } from "@/layouts/dashboard.layout";
import { ProfileLayout } from "@/layouts/sub-layout/profile.layout";
import { $gql } from "@/plugins/http";
import { formatPrice } from "@/utils/mix";
import { $date } from "@/plugins/date";
import Link from "next/link";
import { useCaseDashboard } from "@/hooks/case.hook";
import { UserPaymentMethod } from "@/components/billing/UserPaymentMethod";

const ORDERS_QUERY = `
  query {
    orders: my_orders {
      data {
        id
        created_at
        price
        product {
          name
        }
      }
    }
  }
`

export const USER_BILLING_INFO_QUERY = `
  {
    me {
      payment_method_metadata {
        card {
          last4
          brand
          exp_month
          exp_year
        }
      }
      subscription {
        id
        name
        next_billing_at
        metadata {
          price
          plan_name
          interval_text
        }
      }
    }
  }
`


const BillingPage: NextPageWithLayout = () => {
  const [courtCase] = useCaseDashboard();
  const [orders, setOrders] = useState<any[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<any>();
  const [currentSubscription, setCurrentSubscription] = useState<any>();

  React.useEffect(() => {
    const getOrders = async () => {
      try {
        const data = await $gql(ORDERS_QUERY);
        setOrders(data.orders.data)
      } catch (error) {

      }
    }

    const getBillingInfo = async () => {
      try {
        const data = await $gql(USER_BILLING_INFO_QUERY);

        setPaymentMethod(data.me.payment_method_metadata);
        setCurrentSubscription(data.me.subscription);
      } catch (error) {

      }
    }

    getOrders();
    getBillingInfo();
  }, []);

  return (
    <>
      <div>
        <h2 className="text-2xl font-medium my-9">
          Payment Details
        </h2>
        <div className="rounded-lg bg-white p-10">
          <div className="flex justify-between">
            <h3 className="text-3.3xl text-[#0A0140] font-semibold mb-6">
              Billing Summary
            </h3>

            <Link
              href={`/dashboard/${courtCase.id}/profile/billing/customer`}
            >
              <a className="text-primary-1 font-medium text-lg">
                Edit Billing Information
              </a>
            </Link>
          </div>
          <div className="flex items-center justify-between mb-14">
            <p className="text-xl font-medium text-[#4C4674]">
              {currentSubscription?.metadata?.plan_name} ({currentSubscription?.metadata?.interval_text})
            </p>
            <Link
              href={`/dashboard/${courtCase.id}/profile/billing/plan`}
            >
              <a className="bg-primary-1 rounded-lg text-white py-2.5 px-5 border">
                Change Plan
              </a>
            </Link>
          </div>
        </div>
        <div className="flex items-start justify-between mt-11 w-full mb-[102px]">
          {!!paymentMethod && (
            <UserPaymentMethod
              paymentMethod={paymentMethod}
              subscription={currentSubscription}
            />
          )}
          <div className="w-2.9/5 px-10 py-8 bg-white rounded-lg min-h-[276px]">
            <div className="flex items-center justify-between mb-11">
              <p className="text-natural-8 text-lg">
                Orders History
              </p>
              <p className="cursor-pointer text-[#6200EE] text-lg">
                View All
              </p>
            </div>
            {
              orders.map((order) => (
                <div key={order.id} className="flex items-center justify-between mb-6">
                  <p className="text-lg text-natural-13 font-medium">
                    {$date(order.created_at).format("MMM DD, YYYY")}
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="text-natural-8 font-semibold mr-2.5">
                      ${formatPrice(order.price)}
                    </p>
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      </div>
    </>
  )
}

BillingPage.getLayout = page => (
  <DashboardLayout title="Court - Billing">
    <ProfileLayout>
      {page}
    </ProfileLayout>
  </DashboardLayout>
)

export default BillingPage;
