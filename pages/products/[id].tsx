import React, { useMemo, useState } from "react";
import { $gql } from "@/plugins/http";
import { useRouter } from "next/router";
import { ErrorPage } from "@/components/error/ErrorPage";
import { formatPrice } from "@/utils/mix";
import { Elements } from "@stripe/react-stripe-js";
import { getStripe } from "@/plugins/stripe";
import { BuyProductForm } from "@/components/billing/BuyProductForm";
import { ArrowLeftIcon, ExclamationIcon } from "@heroicons/react/outline";
import { NextPage } from "next";
import Link from "next/link";
import { useCurrentUser } from "@/hooks/user.hook";
import { $date } from "@/plugins/date";
import { Form, Input } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

const stripePromise = getStripe();

const FIND_COUPON_QUERY = `
  query($code: String!) {
    coupon(code: $code) {
      id
      name
      type
      amount_off
      percent_off
      code
    }
  }
`

const FIND_PRODUCT_QUERY = `
  query($id: ID!, $monthly: Boolean = true) {
    product(id: $id) {
      id
      name
      description
      monthly: monthly_price @include(if: $monthly) {
        id
        price
        recurring {
          interval
        }
      }
      annual: annual_price @skip(if: $monthly) {
        id
        price
        recurring {
          interval
        }
      }
    }
  }
`

const ProductDetailPage: NextPage = () => {
  const router = useRouter();
  useCurrentUser("auth", "/")

  const [product, setProduct] = useState<any>();
  const [productLoaded, setProductLoaded] = useState(false);

  const [loading, setLoading] = useState(false);
  const [couponCode, setCouponCode] = useState("");

  const [coupon, setCoupon] = useState<any>();
  const [couponErrorMessage, setCouponErrorMessage] = useState<string>();

  const recurring = useMemo(() => {
    if (["monthly", "annual"].includes(router.query.recurring as string)) {
      return router.query.recurring as string;
    }

    return "monthly"
  }, [router.query.recurring]);

  const nextBillingDate = useMemo(() => {
    if (!product) {
      return null;
    }

    return $date().add(1, product[recurring]?.recurring?.interval ?? "month").format("MMM DD, YYYY")
  }, [product, recurring]);

  // discount price in cent
  const discountPrice = useMemo(() => {
    if (!coupon || !product) {
      return 0;
    }

    if (coupon.type === "fixed") {
      return coupon.amount_off;
    }

    return product[recurring].price * (coupon.percent_off / 100);
  }, [coupon, product, recurring]);

  const totalPrice = useMemo(() => {
    if (!product) {
      return 0;
    }

    return product[recurring].price - discountPrice;
  }, [discountPrice, product, recurring])

  const checkCoupon = async () => {
    setLoading(true);

    try {
      const data = await $gql({
        query: FIND_COUPON_QUERY,
        variables: {
          code: couponCode
        }
      });

      setCouponErrorMessage(
        !data.coupon ? "Invalid coupon code" : undefined
      );

      setCoupon(data.coupon);
    } catch (error) {
      setCouponErrorMessage("Invalid coupon code");
      setCoupon(undefined);
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    const recurring = router.query.recurring as string;

    const findProduct = async () => {
      try {
        const data = await $gql({
          query: FIND_PRODUCT_QUERY,
          variables: {
            id: router.query.id,
            //we will fallback to monthly if user manually input recurring params incorrectly
            monthly: recurring !== "annual",
          }
        });

        setProduct(data.product);
      } catch (error) {

      } finally {
        setProductLoaded(true);
      }
    }

    findProduct();
  }, [router.query.id, router.query.recurring]);

  if (productLoaded && !product) {
    return <ErrorPage />
  }

  return (
    <div className="py-4 bg-gray-50 min-h-screen">
      <div className="fixed left-0 top-0 px-4 py-2">
        <Link href="/">
          <a className="text-gray-700 flex items-center">
            <ArrowLeftIcon className="h-6 w-6 mr-1" />
            <span>Back to Home</span>
          </a>
        </Link>
      </div>

      <div className="max-w-2xl pt-12 mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8">
        <h1 className="sr-only">Checkout</h1>

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <ExclamationIcon className="h-5 w-5 text-yellow-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                MyCourtClerk never store your card information!
              </p>
            </div>
          </div>
        </div>

        <Elements stripe={stripePromise}>
          <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
            <div>
              {!!product && <BuyProductForm product={product} />}
            </div>

            {!!product && (
              <div className="mt-10 lg:mt-0">
                <h2 className="text-lg font-medium text-gray-900">Order summary</h2>

                <div className="mt-4 bg-white rounded-lg shadow-sm">
                  <h3 className="sr-only">Items in your cart</h3>

                  <div className="flex py-2 px-4 sm:px-6">
                    {/* Apply image here later */}
                    {/* <div className="flex-shrink-0 mr-6">
                        <img src={product.imageSrc} alt={product.imageAlt} className="w-20 rounded-md" />
                      </div> */}
                    <div className="flex-1 flex flex-col">
                      <div className="flex">
                        <div className="min-w-0 flex-1">
                          <h4 className="text-lg font-bold text-gray-700">
                            {product.name}
                          </h4>
                        </div>
                      </div>

                      <div className="flex-1 flex items-end justify-between">
                        <p className="text-sm font-medium text-gray-600">{product.description}</p>
                        <p className="text-sm font-medium text-gray-600">
                          ${formatPrice(product[recurring]?.price)} / {product[recurring]?.recurring?.interval}
                        </p>
                      </div>
                    </div>
                  </div>

                  <dl className="border-t border-gray-200 divide-y divide-y-200 py-2 px-4 sm:px-6">
                    <div className="flex items-center justify-between py-2">
                      <dt className="text-sm">Next Billing</dt>
                      <dd className="text-sm font-medium text-gray-900 capitalize">
                        {nextBillingDate}
                      </dd>
                    </div>

                    {!!coupon && (
                      <div className="flex items-center justify-between py-2">
                        <dt className="text-sm">Discount</dt>
                        <dd className="text-sm font-medium text-gray-900 capitalize">
                          -${formatPrice(discountPrice)}
                        </dd>
                      </div>
                    )}

                    <div className="flex items-center justify-between py-2">
                      <dt className="text-base font-medium">Total</dt>
                      <dd className="text-base font-medium text-gray-900">
                        ${formatPrice(totalPrice)}
                      </dd>
                    </div>
                  </dl>

                  {/* <div className="px-4 py-2 sm:px-6">
                    <Form onSubmit={checkCoupon}>
                      <label htmlFor="couponCode" className="block text-sm font-medium text-gray-700">
                        Coupon code
                      </label>
                      <div className="flex space-x-4 mt-1">
                        <Input value={couponCode} onChangeText={setCouponCode} />

                        <Button
                          type="submit"
                          isLoading={loading}
                          disabled={!couponCode || loading}
                        >
                          Apply
                        </Button>
                      </div>

                      {!!couponErrorMessage && (
                        <p className="text-xs text-red-500 mt-1">{couponErrorMessage}</p>
                      )}
                    </Form>
                  </div> */}
                </div>
              </div>
            )}
          </div>
        </Elements>
      </div>
    </div>
  )
}

export default ProductDetailPage;
