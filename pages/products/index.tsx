import { Content } from "@/components/Content";
import { useCurrentUser } from "@/hooks/user.hook";
import { $gql } from "@/plugins/http";
import { classNames } from "@/utils/classname";
import { formatPrice } from "@/utils/mix";
import { ArrowLeftIcon } from "@heroicons/react/outline";
import { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import React, { useState } from "react";

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
/**
 * If products feature is available we may move this page to other path/dirs
 */
const ProductsPage: NextPage = () => {
  const { user } = useCurrentUser("auth", "/");
  const [products, setProducts] = useState<any[]>([]);
  const [billingInterval, setBillingInterval] = useState("monthly");

  React.useEffect(() => {
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
    <>
      <Head>
        <title key="title">Court - Buy Products</title>
      </Head>

      <Content>
        <h1 className="sr-only">Court Products</h1>

        <section className="flex flex-col min-h-screen items-center justify-center py-4">
          <div className="fixed left-0 top-0 px-4 py-2">
            <Link href="/">
              <a className="text-gray-700 flex items-center">
                <ArrowLeftIcon className="h-6 w-6 mr-1" />
                <span>Back to Home</span>
              </a>
            </Link>
          </div>

          <Link href="/">
            <a>
              <img src="/logo.png" alt="Court Logo" className="h-14" />
            </a>
          </Link>

          {!!user && user.isOwner && (
            <div className="px-8 py-6 w-full max-w-screen-xl mx-auto">
              <div className="text-center mb-4">
                <h2 className="text-2xl font-bold text-gray-700">Buy Case Product</h2>
                <p className="text-sm text-gray-600">Buy products to use MyCourtClerk</p>
              </div>

              <div className="relative mt-12 flex justify-center sm:mt-16 mb-4">
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
                    Monthly billing
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
                    Annual billing
                  </button>
                </div>
              </div>

              <div className="grid grid-cols lg:grid-cols-3 gap-4">
                {products.map((product) => (
                  <div key={product.name} className="border border-gray-200 rounded-lg shadow-sm divide-y divide-gray-200">
                    <div className="p-6">
                      <h2 className="text-lg leading-6 font-medium text-gray-900">{product.name}</h2>
                      <p className="mt-4 text-sm text-gray-500">{product.description}</p>
                      {!!product[billingInterval] && (
                        <>
                          <p className="mt-8 flex">
                            <span className="text-4xl font-extrabold text-gray-900">
                              ${formatPrice(product[billingInterval].price)}
                            </span>

                            <span className="text-4xl font-extrabold text-gray-900">
                              /{product[billingInterval].recurring.interval}
                            </span>
                          </p>
                          <Link href={{
                            pathname: "/products/[id]",
                            query: {
                              id: product.id,
                              recurring: billingInterval
                            }
                          }}>
                            <a
                              className="mt-8 block w-full bg-gray-800 border border-gray-800 rounded-md py-2 text-sm font-semibold text-white text-center hover:bg-gray-900"
                            >
                              Buy {product.name}
                            </a>
                          </Link>
                        </>
                      )}

                      {!!product.content && (
                        <div dangerouslySetInnerHTML={{ __html: product.content }} className="mt-2 prose prose-sm" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </section>
      </Content>
    </>
  )
}

export default ProductsPage;
