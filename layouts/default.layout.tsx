import { FeedbackBanner } from "@/components/banner/FeedbackBanner";
import { Footer } from "@/components/layout/Footer";
import { useAuth } from "@/hooks/auth.hook";
import { ReactProps } from "@/interfaces/react.props"
import { $user, $userLoaded } from "@/store/auth.store"
import { Popover, Transition } from "@headlessui/react";
import { MenuIcon, XIcon } from "@heroicons/react/outline";
import { useStore } from "effector-react"
import Link from "next/link";
import Router from "next/router";
import React, { Fragment } from "react";

const navigation: any = [
  // { name: "Product", href: "#" },
  // { name: "Features", href: "#" },
  // { name: "Marketplace", href: "#" },
  // { name: "Company", href: "#" },
]

export const DefaultLayout: React.FC<ReactProps> = ({ children }) => {
  const user = useStore($user);
  const userLoaded = useStore($userLoaded);
  const { logout } = useAuth();

  const logoutAndRedirect = async() => {
    await logout();
    Router.replace("/")
  }

  const getDashboardPage = React.useMemo(() => {
    if (!user) {
      return "/auth/register";
    }

    if (!!user.roles.find((o: any) => o.name === "admin")) {
      return "/super-admin";
    }

    return "/dashboard"
  }, [user])

  return (
    <div className="h-full flex">
      <div className="flex-1 flex flex-col overflow-hidden">
        <FeedbackBanner />
        <Popover as="header" className="relative">
          <div className="bg-white py-4 border-b">
            <nav
              className="relative max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6"
              aria-label="Global"
            >
              <div className="flex items-center flex-1">
                <div className="flex items-center justify-between w-full md:w-auto">
                  <Link href="/">
                    <a>
                      <span className="sr-only">Workflow</span>
                      <img
                        className="h-8 w-auto sm:h-10"
                        src="/logo.png"
                        alt="Court Logo"
                      />
                    </a>
                  </Link>
                  <div className="-mr-2 flex items-center md:hidden">
                    <Popover.Button className="bg-gray-900 rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:bg-gray-800 focus:outline-none focus:ring-2 focus-ring-inset focus:ring-white">
                      <span className="sr-only">Open main menu</span>
                      <MenuIcon className="h-6 w-6" aria-hidden="true" />
                    </Popover.Button>
                  </div>
                </div>
                <div className="hidden space-x-8 md:flex md:ml-10">
                  {navigation.map((item) => (
                    <a key={item.name} href={item.href} className="text-base font-medium text-slate-700 hover:text-slate-800">
                      {item.name}
                    </a>
                  ))}
                </div>
              </div>
              {
                userLoaded && (
                  <div className="hidden md:flex md:items-center md:space-x-6">
                    {!user && (
                      <Link href="/auth/login">
                        <a className="text-base font-medium text-slate-700">
                          Login
                        </a>
                      </Link>
                    )}
                    <Link
                      href={{
                        pathname: getDashboardPage,
                      }}
                    >
                      <a className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700">
                        {!!user ? "Dashboard" : "Register"}
                      </a>
                    </Link>

                    {!!user && (
                      <button type="button" onClick={logoutAndRedirect} className="text-slate-700 font-medium">Logout</button>
                    )}
                  </div>
                )
              }
            </nav>
          </div>

          <Transition
            as={Fragment}
            enter="duration-150 ease-out"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="duration-100 ease-in"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Popover.Panel focus className="absolute z-10 top-0 inset-x-0 p-2 transition transform origin-top md:hidden">
              <div className="rounded-lg shadow-md bg-white ring-1 ring-black ring-opacity-5 overflow-hidden">
                <div className="px-5 pt-4 flex items-center justify-between">
                  <div>
                    <img
                      className="h-8 w-auto"
                      src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
                      alt=""
                    />
                  </div>
                  <div className="-mr-2">
                    <Popover.Button className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-600">
                      <span className="sr-only">Close menu</span>
                      <XIcon className="h-6 w-6" aria-hidden="true" />
                    </Popover.Button>
                  </div>
                </div>
                <div className="pt-5 pb-6">
                  <div className="px-2 space-y-1">
                    {navigation.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-50"
                      >
                        {item.name}
                      </a>
                    ))}
                  </div>
                  {!user ? (
                    <>
                      <div className="mt-6 px-5">
                        <Link href="/auth/register">
                          <a
                            className="block text-center w-full py-3 px-4 rounded-md shadow bg-indigo-600 text-white font-medium hover:bg-indigo-700"
                          >
                            Register
                          </a>
                        </Link>
                      </div>
                      <div className="mt-6 px-5">
                        <p className="text-center text-base font-medium text-gray-500">
                          Existing customer?{" "}
                          <Link href="/auth/login">
                            <a className="text-gray-900 hover:underline">
                              Login
                            </a>
                          </Link>
                        </p>
                      </div>
                    </>
                  ) : (
                    <div className="mt-6 px-5">
                      <Link href={getDashboardPage}>
                        <a
                          className="block text-center w-full py-3 px-4 rounded-md shadow bg-indigo-600 text-white font-medium hover:bg-indigo-700"
                        >
                          Dashboard
                        </a>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </Popover.Panel>
          </Transition>
        </Popover>

        <div className="flex-1 flex items-stretch overflow-hidden bg-gray-100">
          <main className="flex-1 overflow-y-auto">
            {children}
            <Footer />
          </main>
        </div>
      </div>
    </div>
  )
}
