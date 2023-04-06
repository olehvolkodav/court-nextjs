import React, { Fragment, useReducer, useState } from "react"
import { useRouter } from "next/router";
import { Menu, Transition } from "@headlessui/react"
import { classNames } from "@/utils/classname";
import { ChevronDownIcon } from "@heroicons/react/solid"
import Link from "next/link"
import { paginationInitialState, paginationReducer } from "@/reducers/pagination.reducer";
import { Pagination } from "@/components/ui/pagination/Pagination";
import { PAGINATION_FIELD } from "@/graphql/query/util";
import { withAdminLayout } from "@/hoc/layout";
import { $gql } from "@/plugins/http";
import { ProductList } from "@/components/product/ProductList";

const PRODUCTS_QUERY = `
  query($page: Int) {
    admin_products(page: $page) {
      ${PAGINATION_FIELD}
      data {
        id
        name
        status
        created_at
        prices {
          id
          price
          recurring {
            interval
            interval_count
          }
        }
      }
    }
  }
`

const ProductsPage: React.FC = () => {
  const router = useRouter();

  const [pagination, dispatch] = useReducer(paginationReducer, paginationInitialState);
  const [products, setProducts] = useState<any[]>([]);
  const [refreshCount, setRefreshCount] = useState(0);

  // either remove or publish
  const refreshProducts = () => {
    setRefreshCount(prev => prev + 1)
  }

  React.useEffect(() => {
    const getProducts = async () => {
      const page = parseInt(router.query?.page as string) || 1;

      try {
        const data = await $gql({
          query: PRODUCTS_QUERY,
          variables: { page }
        });

        setProducts(data.admin_products.data);
        dispatch({ type: "set", value: data.admin_products.paginatorInfo });
      } catch (error) {
      }
    }
    getProducts();
  }, [router.query.page, refreshCount]);

  return (
    <div className="py-4">
      <div className="container px-4 mx-auto sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Products</h1>
          </div>

          <div className="flex items-center">
            {/* <Link href="/super-admin/products/create">
              <a className="inline-flex font-medium mr-2 text-sm justify-center text-white bg-indigo-600 hover:bg-indigo-700 px-2.5 py-1.5 rounded">
                + Add New
              </a>
            </Link> */}

            <Menu as="div" className="relative inline-block text-left">
              <div className="py-3">
                <Menu.Button className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-1.5 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500">
                  Sort
                  <ChevronDownIcon className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
                </Menu.Button>
              </div>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="z-index-9999 origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <a
                          href="#"
                          className={classNames(
                            active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                            "block px-4 py-2 text-sm"
                          )}
                        >
                          A-Z
                        </a>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <a
                          href="#"
                          className={classNames(
                            active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                            "block px-4 py-2 text-sm"
                          )}
                        >
                          Z-A
                        </a>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>

        <div className="rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="x-2-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {products.map((product) => (
                  <ProductList product={product} key={product.id} onProductUpdate={refreshProducts} />
                ))}
              </tbody>
            </table>
          </div>

          <Pagination data={pagination} className="px-4 py-2 bg-white mt-4" />
        </div>
      </div>
    </div>
  )
}

export default withAdminLayout(ProductsPage, "Court - Products");
