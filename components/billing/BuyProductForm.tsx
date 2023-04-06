import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { StripeCardElementChangeEvent, StripeCardElement } from "@stripe/stripe-js";
import React, { useMemo, useState } from "react";
import { Button } from "../ui/button"
import { Form, Label } from "../ui/form";
import { $http } from "@/plugins/http";
import { useToast } from "@/hooks/toast.hook";
import Router, { useRouter } from "next/router";
import { useAuth } from "@/hooks/auth.hook";

interface Props {
  product: any;
  coupon?: any;
}

export const BuyProductForm: React.FC<Props> = ({ product, coupon }) => {
  const toast = useToast();
  const stripe = useStripe();
  const elements = useElements();
  const { refetch } = useAuth();
  const router = useRouter();

  const [isCardValid, setIsCardValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tosChecked, setTosChecked] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string>();

  const recurring = useMemo(() => {
    if (["monthly", "annual"].includes(router.query.recurring as string)) {
      return router.query.recurring as string;
    }

    return "monthly"
  }, [router.query.recurring]);

  const handleCardChange = (e: StripeCardElementChangeEvent) => {
    setIsCardValid(e.complete);
  }

  const toggleTos = () => setTosChecked(prev => !prev);

  const saveOrder = async () => {
    const data: any = {
      product_id: product.id,
      price_id: product[recurring]?.id,
      coupon_code: coupon?.code,
    }

    return $http.post("/orders", data);
  }

  const processPayment = async () => {
    setLoading(true);

    try {
      const card = elements?.getElement("card") as StripeCardElement;

      const result = await stripe?.createPaymentMethod({
        type: "card",
        card,
      });

      if (result?.error) {
        return setErrorMessage(result?.error?.message);
      }

      await $http.patch("/auth/payment-method", {
        payment_id: result?.paymentMethod?.id
      });

      await saveOrder();

      toast.show({
        message: "Product purchased!"
      });

      await refetch();

      Router.replace("/dashboard");
    } catch (err: any) {
      toast.show({
        message: "Something went wrong when saving your payment method",
        status: "error",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form onSubmitPrevent={processPayment}>
      <h2 className="text-lg font-medium text-gray-900 mb-4">Payment Method</h2>

      <div className="bg-white shadow-sm rounded-lg px-4 py-2 space-y-4">
        <div>
          <Label>Card Information</Label>

          <CardElement
            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md px-3 py-2.5 border"
            options={{
              hidePostalCode: true,
            }}
            onChange={handleCardChange}
          />

          {!!errorMessage && (
            <span className="block text-red-500 mt-1 text-xs">
              {errorMessage}
            </span>
          )}
        </div>

        <div>
          <label htmlFor="tos" className="flex items-center">
            <input type="checkbox" className="mr-2 rounded" id="tos" checked={tosChecked} onChange={toggleTos} />
            <span className="mr-1 select-none">By buying this product, you agree to our</span>
            <a href="/terms-of-service" target="_blank" className="text-primary-1">terms of service</a>
          </label>
        </div>

        <div>
          <Button type="submit" className="w-full" disabled={!isCardValid || loading || !tosChecked} isLoading={loading}>
            Buy Product
          </Button>
        </div>
      </div>
    </Form>
  )
}
