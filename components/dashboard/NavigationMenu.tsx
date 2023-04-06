import React, { Fragment, useEffect } from "react";
import { Disclosure, Menu, Transition, Popover, } from "@headlessui/react"
import { ChevronDownIcon, SearchIcon, DocumentIcon, MenuIcon, XIcon, MailIcon } from "@heroicons/react/outline"
import { navigations as userNavigations, adminNavigations } from "./NavigationMenuLinks"
import { classNames } from "@/utils/classname";
import { useStore } from "effector-react";
import { $user, setUser } from "@/store/auth.store";
import Link from "next/link";
import { GlobalSearch } from "../GlobalSearch";
import { $gql, $http } from "@/plugins/http";
import { useRouter } from "next/router";
import { MenuLink } from "../ui/link";
import Cookies from "js-cookie";
import { useLink } from "@/hooks/link.hook";
import { useCaseQuery } from "@/graphql/execution/case";
import { useToast } from "@/hooks/toast.hook";

const PAGES_QUERY = `
{
  pages: navigation_content_pages {
    id
    title
    slug
    navigation {
      identifier
    }
  }
}
`

export const NavigationMenu: React.FC<{ admin?: boolean }> = ({ admin }) => {
  const toast = useToast();
  const user = useStore($user);
  const router = useRouter();
  const { isRouteActive } = useLink();

  const [searchOpen, setSearchOpen] = React.useState(false);
  const [pages, setPages] = React.useState<any[]>([]);

  const [courtCase] = useCaseQuery({
    skip: admin,
    variables: {
      id: router.query.case,
    }
  })

  const showSearch = () => setSearchOpen(true);

  const navigations = React.useMemo(() => {
    const staticNavigations = admin ? adminNavigations : userNavigations;

    if (pages.length) {
      return staticNavigations.map(navigation => {
        const page = pages.find(page => page.navigation.identifier === navigation.id);

        if (!!page) {
          navigation.subMenus.push({
            name: page.title,
            href: `/dashboard/content/${page.slug}`,
            icon: DocumentIcon,
          })
        }

        return navigation;
      })
    }

    return staticNavigations;
  }, [admin, pages]);

  const logout = async () => {
    try {
      await $http.post("/auth/logout");
      Cookies.remove("court_auth_token");

      await router.replace("/");

      setUser(null);
    } catch (error) {

    }
  }

  // only for case dashboard
  const copyEmail = () => {
    navigator.clipboard.writeText(courtCase.email).then(() => {
      toast.show({ message: "Email copied to clipboard" })
    });
  }

  useEffect(() => {
    const getPages = async () => {
      try {
        const data = await $gql(PAGES_QUERY);

        setPages(data.pages)
      } catch (error) {
        console.log(error)
      }
    }

    getPages()
  }, [])

  return (
    <>
      <Disclosure as="nav">
        {({ open }) => (
          <>
            <Popover as="header" className="relative">
              <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Link href="/">
                        <a>
                          <img
                            className="h-6"
                            src="/logo.png"
                            alt="Court Clerk"
                          />
                        </a>
                      </Link>
                    </div>

                  </div>
                  <div>
                    <div className="ml-4 flex items-center md:ml-6">
                      {!admin && (
                        <button
                          type="button"
                          className="p-3 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-600 focus:ring-white inline-flex items-center hidden md:flex"
                          onClick={copyEmail}
                        >
                          <MailIcon className="h-6 w-6 text-gray-600 mr-2" />
                          {courtCase.email}
                        </button>
                      )}

                      <button
                        type="button"
                        className="p-3 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-600 focus:ring-white"
                        onClick={showSearch}
                      >
                        <span className="sr-only">View notifications</span>
                        <SearchIcon className="h-6 w-6 color-gray" aria-hidden="true" />
                      </button>

                      {/* Profile dropdown */}
                      <Menu as="div" className="ml-3 relative z-10">
                        <div>
                          <Menu.Button className="max-w-xs bg-indigo-600 rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-600 focus:ring-white">
                            <span className="sr-only">Open user menu</span>

                            {user?.avatar?.url ? (
                              <img className="h-8 w-8 rounded-full" src={user.avatar.url} alt="User Avatar" />
                            ) : (
                              <span className="h-8 w-8 rounded-full overflow-hidden bg-gray-100">
                                <svg className="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                              </span>
                            )}
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
                          <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-index-9999">
                            <Link href={admin ? "/super-admin/profile" : `/dashboard/${router.query.case}/profile`}>
                              <a className="block w-full text-left px-4 py-2 text-sm text-gray-700">
                                Your Profile
                              </a>
                            </Link>

                            <Menu.Item>
                              <button onClick={logout} type="button" className="block w-full text-left px-4 py-2 text-sm text-gray-700">
                                Sign Out
                              </button>
                            </Menu.Item>
                          </Menu.Items>
                        </Transition>
                      </Menu>
                      <div className="-mr-2 flex items-center ml-4 2xl:hidden">
                        <Popover.Button className="bg-gray-900 rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:bg-gray-800 focus:outline-none focus:ring-2 focus-ring-inset focus:ring-white">
                          <span className="sr-only">Open main menu</span>
                          <MenuIcon className="h-6 w-6" aria-hidden="true" />
                        </Popover.Button>
                      </div>
                    </div>
                  </div>
                </div>
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
                <Popover.Panel focus className="absolute z-40 -top-4 inset-x-0 p-5 transition transform origin-top 2xl:hidden" >
                  <div className="rounded-lg shadow-md bg-white p-5 ring-1 ring-black ring-opacity-5">
                    <div className="flex justify-between">
                      <div className="flex-shrink-0">
                        <Link href="/">
                          <a>
                            <img
                              className="h-6"
                              src="/logo.png"
                              alt="Court Clerk"
                            />
                          </a>
                        </Link>
                      </div>
                      <div className="-mr-2">
                        <Popover.Button className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-600">
                          <span className="sr-only">Close menu</span>
                          <XIcon className="h-6 w-6" aria-hidden="true" />
                        </Popover.Button>
                      </div>
                    </div>
                    {navigations.map((item) => (
                      <Menu as="div" key={item.name} className="relative">
                        {
                          !!item.subMenus.length ? (
                            <Menu.Button className="inline-flex text-natural-13 hover:bg-natural-3 rounded-full justify-center items-center px-3 py-1.5">
                              <item.icon className="mr-2 flex-shrink-0 h-5 w-5" aria-hidden="true" />
                              {item.name}
                              {!!item.subMenus.length && <ChevronDownIcon className={"ml-2 h-4 w-4"} />}
                            </Menu.Button>
                          ) : (
                            < Popover.Button as={MenuLink}
                              href={
                                admin ? item.href : `/dashboard/${router.query.case}${item.href}`
                              }
                              className={classNames(
                                "inline-flex rounded-full justify-center items-center px-3 py-1.5",
                                isRouteActive(item.href) ? "bg-primary-1 text-white" : "text-natural-13 hover:bg-natural-3",
                              )
                              }
                            >
                              <item.icon className="mr-2 flex-shrink-0 h-5 w-5" aria-hidden="true" />
                              {item.name}
                            </ Popover.Button>
                          )
                        }

                        {
                          !!item.subMenus.length && (
                            <Transition
                              as={React.Fragment}
                              enter="transition ease-out duration-100"
                              enterFrom="transform opacity-0 scale-95"
                              enterTo="transform opacity-100 scale-100"
                              leave="transition ease-in duration-75"
                              leaveFrom="transform opacity-100 scale-100"
                              leaveTo="transform opacity-0 scale-95"
                            >
                              <Menu.Items className="z-10 origin-top-right absolute -right-25 mt-2 w-56 rounded-lg shadow-sm bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                                {
                                  item.subMenus.map((submenu) => (
                                    <Menu.Item key={submenu.name}>
                                      <Popover.Button as={MenuLink}
                                        href={
                                          admin ? submenu.href : `/dashboard/${router.query.case}${submenu.href}`
                                        } className={classNames(
                                          "group flex items-center px-3 py-1.5 text-sm hover:bg-gray-100 text-natural-13",
                                        )}
                                      >
                                        <submenu.icon className="mr-4 flex-shrink-0 h-5 w-5 text-natural-7" aria-hidden="true" />
                                        {submenu.name}
                                      </Popover.Button>
                                    </Menu.Item>
                                  ))
                                }
                              </Menu.Items>
                            </Transition>
                          )
                        }

                      </Menu>
                    ))}
                  </div>
                </Popover.Panel>
              </Transition>
            </Popover>
            <hr />
            <div className="container mx-auto px-4">
              <div className=" hidden flex items-center justify-between h-16 2xl:flex">
                <div className="flex items-center">
                  <div>
                    <div className="flex space-x-4">
                      {navigations.map((item) => (
                        <Menu as="div" key={item.name} className="relative">
                          {
                            !!item.subMenus.length ? (
                              <Menu.Button className="inline-flex text-natural-13 hover:bg-natural-3 rounded-full justify-center items-center px-3 py-1.5">
                                <item.icon className="mr-2 flex-shrink-0 h-5 w-5" aria-hidden="true" />
                                {item.name}
                                {!!item.subMenus.length && <ChevronDownIcon className={"ml-2 h-4 w-4"} />}
                              </Menu.Button>
                            ) : (
                              <MenuLink
                                href={
                                  admin ? item.href : `/dashboard/${router.query.case}${item.href}`
                                }
                                className={classNames(
                                  "inline-flex rounded-full justify-center items-center px-3 py-1.5",
                                  isRouteActive(item.href) ? "bg-primary-1 text-white" : "text-natural-13 hover:bg-natural-3",
                                )
                                }
                              >
                                <item.icon className="mr-2 flex-shrink-0 h-5 w-5" aria-hidden="true" />
                                {item.name}
                              </MenuLink>
                            )
                          }

                          {
                            !!item.subMenus.length && (
                              <Transition
                                as={React.Fragment}
                                enter="transition ease-out duration-100"
                                enterFrom="transform opacity-0 scale-95"
                                enterTo="transform opacity-100 scale-100"
                                leave="transition ease-in duration-75"
                                leaveFrom="transform opacity-100 scale-100"
                                leaveTo="transform opacity-0 scale-95"
                              >
                                <Menu.Items className="z-10 origin-top-right absolute -right-25 mt-2 w-56 rounded-lg shadow-sm bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                                  {
                                    item.subMenus.map((submenu) => (
                                      <Menu.Item key={submenu.name}>
                                        <MenuLink href={
                                          admin ? submenu.href : `/dashboard/${router.query.case}${submenu.href}`
                                        } className={classNames(
                                          "group flex items-center px-3 py-1.5 text-sm hover:bg-gray-100 text-natural-13",
                                        )}
                                        >
                                          <submenu.icon className="mr-4 flex-shrink-0 h-5 w-5 text-natural-7" aria-hidden="true" />
                                          {submenu.name}
                                        </MenuLink>
                                      </Menu.Item>
                                    ))
                                  }
                                </Menu.Items>
                              </Transition>
                            )
                          }

                        </Menu>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </Disclosure>
      <GlobalSearch isOpen={searchOpen} onClose={setSearchOpen} />
    </>
  )
}

NavigationMenu.defaultProps = {
  admin: false,
}
