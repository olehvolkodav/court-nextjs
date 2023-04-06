import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/toast.hook";
import { NextPageWithLayout } from "@/interfaces/page.type";
import { DashboardLayout } from "@/layouts/dashboard.layout";
import { ProfileLayout } from "@/layouts/sub-layout/profile.layout";
import { $gql, $http } from "@/plugins/http";
import { classNames } from "@/utils/classname";
import { formatPrice } from "@/utils/mix";
import Router from "next/router";
import { useEffect, useState } from "react";

const RESERVED_PRODUCTS_QUERY = `
  query($monthly: Boolean = true) {
    products: case_products {
      id
      name
      slug
      description
      content
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

const PlanPage: NextPageWithLayout = () => {
  const toast = useToast();

  const [products, setProducts] = useState<any[]>([]);
  const [billingInterval, setBillingInterval] = useState("monthly");

  const [loading, setLoading] = useState(false);

  // TODO, add confirm modal first before hitting subscriptions API
  const changePlan = (productPrice: any) => async () => {
    setLoading(true);

    try {
      await $http.patch("/subscriptions", {
        price_id: productPrice.id
      });

      toast.show({
        message: "Your plan has been changed successfully",
      })

      Router.back();
    } catch (error: any) {
      toast.show({
        message: error?.response?.data?.message || "Something went wrong",
      })
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const getProducts = async () => {
      try {
        const data = await $gql({
          query: RESERVED_PRODUCTS_QUERY,
          variables: {
            monthly: billingInterval === "monthly"
          }
        });

        setProducts(data.products);
      } catch (error) {

      }
    }

    getProducts();
  }, [billingInterval]);

  return (
    <div className="py-4">
      <div className="container px-4 mx-auto">
        <div className="mb-4">
          <h1 className="text-2xl font-medium text-natural-13">Change Plan</h1>
        </div>

        <div>
          <div className="relative flex justify-center mb-4">
            <div className="bg-gray-700 p-0.5 rounded-lg flex">
              <button
                type="button"
                className={
                  classNames(
                    "relative py-2 px-6 border-gray-700 rounded-md shadow-sm text-sm font-medium whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-700 focus:ring-white focus:z-10",
                    billingInterval === "monthly" ? "bg-white text-gray-700" : "bg-gray-700 text-white hover:bg-gray-800",
                  )
                }
                onClick={() => setBillingInterval("monthly")}
              >
                Monthly
              </button>
              <button
                type="button"
                className={
                  classNames(
                    "ml-0.5 relative py-2 px-6 border border-transparent rounded-md text-sm font-medium whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-700 focus:ring-white focus:z-10",
                    billingInterval === "annual" ? "bg-white text-gray-700" : "bg-gray-700 text-white hover:bg-gray-800",
                  )
                }
                onClick={() => setBillingInterval("annual")}
              >
                Annual
              </button>
            </div>
          </div>

          <div className="grid grid-cols lg:grid-cols-3 gap-4">
            {products.map((product) => (
              <div key={product.name} className="border border-gray-200 rounded-lg shadow-sm divide-y divide-gray-200 bg-white">
                <div className="p-6">
                  <h2 className="text-lg leading-6 font-medium text-gray-900">{product.name}</h2>
                  <p className="mt-4 text-sm text-gray-500">{product.description}</p>
                  {!!product[billingInterval] ? (
                    <>
                      <p className="mt-8 flex">
                        <span className="text-4xl font-extrabold text-gray-900">
                          ${formatPrice(product[billingInterval].price)}
                        </span>

                        <span className="text-4xl font-extrabold text-gray-900">
                          /{product[billingInterval].recurring.interval}
                        </span>
                      </p>

                      <Button
                        className="w-full mt-8"
                        isLoading={loading}
                        onClick={changePlan(product[billingInterval])}
                      >
                        Change to {product.name}
                      </Button>
                    </>
                  ) : (
                    <div className="mt-8">
                      <p>Your Current Subscription</p>
                    </div>
                  )}

                  {!!product.content && (
                    <div dangerouslySetInnerHTML={{ __html: product.content }} className="mt-2 prose prose-sm" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

PlanPage.getLayout = (page) => (
  <DashboardLayout title="Court - Change Plan">
    <ProfileLayout>
      {page}
    </ProfileLayout>
  </DashboardLayout>
)

export default PlanPage;
