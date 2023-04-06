import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/form";
import { useToast } from "@/hooks/toast.hook";
import { NextPageWithLayout } from "@/interfaces/page.type";
import { DashboardLayout } from "@/layouts/dashboard.layout";
import { ProfileLayout } from "@/layouts/sub-layout/profile.layout";
import { $http } from "@/plugins/http";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { StripeCardElement, StripeCardElementChangeEvent } from "@stripe/stripe-js";
import Router from "next/router";
import React, { useState } from "react";

const PaymentMethodPage: NextPageWithLayout = () => {
  const stripe = useStripe();
  const elements = useElements();
  const toast = useToast();

  const [isCardValid, setIsCardValid] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCardChange = (e: StripeCardElementChangeEvent) => {
    setIsCardValid(e.complete);
  }

  const savePaymentMethod = async() => {
    setLoading(true);

    try {
      const result = await stripe?.createPaymentMethod({
        type: "card",
        card: elements?.getElement("card") as StripeCardElement,
      });

      if (!result || !!result?.error) {
        return toast.show({
          message: "failed to save payment method, please try again",
          status: "error"
        })
      }

      await $http.patch("/auth/payment-method", {
        payment_id: result.paymentMethod?.id
      });

      toast.show({message: "Payment method saved"})

      Router.replace(`/dashboard/${Router.query.case}/profile/billing`);
    } catch (error: any) {
      toast.show({
        message: "Something went wrong when saving your payment method",
        status: "error",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <h1 className="text-2xl font-medium text-natural-13 mb-4">Update Payment Method</h1>

      <div className="bg-white shadow-sm rounded-lg">
        <div className="px-4 py-2 space-y-4">
          <div>
            <Label>Card Information</Label>

            <CardElement
              className="max-w-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md px-3 py-2.5 border"
              options={{
                hidePostalCode: true,
              }}
              onChange={handleCardChange}
            />
          </div>

          <div>
            <Button onClick={savePaymentMethod} disabled={!isCardValid || loading} isLoading={loading}>
              Save Payment Method
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}

PaymentMethodPage.getLayout = page => (
  <DashboardLayout title="Court - Payment Method">
    <ProfileLayout>
      {page}
    </ProfileLayout>
  </DashboardLayout>
)

export default PaymentMethodPage;
