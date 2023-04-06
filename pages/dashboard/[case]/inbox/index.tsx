import {
  InboxIcon,
  ReplyIcon,
  PencilIcon,
  StarIcon,
  TrashIcon,
  SparklesIcon,
  DotsVerticalIcon,
  RefreshIcon
} from "@heroicons/react/outline"

import {ChevronRightIcon, MailIcon, SearchIcon } from "@heroicons/react/solid"
import { classNames } from "@/utils/classname";
import Head from "next/head";
import { DashboardLayout } from "@/layouts/dashboard.layout";

const inboxes = [
  {
    applicant: {
      name: "Ricardo Cooper",
      email: "ricardo.cooper@example.com",
      imageUrl:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
    date: "2020-01-07",
    dateFull: "January 7, 2020",
    href: "#",
  },
  {
    applicant: {
      name: "Kristen Ramos",
      email: "kristen.ramos@example.com",
      imageUrl:
        "https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
    date: "2020-01-07",
    dateFull: "January 7, 2020",
    href: "#",
  },
  {
    applicant: {
      name: "Ted Fox",
      email: "ted.fox@example.com",
      imageUrl:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
    date: "2020-01-07",
    dateFull: "January 7, 2020",
    href: "#",
  },
  {
    applicant: {
      name: "Kristen Fox",
      email: "ted.fox@example.com",
      imageUrl:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
    date: "2020-01-07",
    dateFull: "January 7, 2020",
    href: "#",
  },
  {
    applicant: {
      name: "Ted Kristen",
      email: "ted.fox@example.com",
      imageUrl:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
    date: "2020-01-07",
    dateFull: "January 7, 2020",
    href: "#",
  },
  {
    applicant: {
      name: "TedFox Kristen",
      email: "ted.fox@example.com",
      imageUrl:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
    date: "2020-01-07",
    dateFull: "January 7, 2020",
    href: "#",
  },
  {
    applicant: {
      name: "Kristen TedFox",
      email: "TedFox.fox@example.com",
      imageUrl:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
    date: "2020-01-07",
    dateFull: "January 7, 2020",
    href: "#",
  },
  {
    applicant: {
      name: "Louetta Esses",
      email: "Louetta.fox@example.com",
      imageUrl:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
    date: "2020-01-07",
    dateFull: "January 7, 2020",
    href: "#",
  },
  {
    applicant: {
      name: "Waldemar Mannering",
      email: "Waldemar.fox@example.com",
      imageUrl:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
    date: "2020-01-07",
    dateFull: "January 7, 2020",
    href: "#",
  },
  {
    applicant: {
      name: "Eb Begg",
      email: "Begg.fox@example.com",
      imageUrl:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
    date: "2020-01-07",
    dateFull: "January 7, 2020",
    href: "#",
  },
  {
    applicant: {
      name: "Modestine Spat",
      email: "Modestine.fox@example.com",
      imageUrl:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
    date: "2020-01-07",
    dateFull: "January 7, 2020",
    href: "#",
  },
  {
    applicant: {
      name: "Shawne developer",
      email: "Modestine.fox@example.com",
      imageUrl:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
    date: "2020-01-07",
    dateFull: "January 7, 2020",
    href: "#",
  },
];
const navigations = [
  {
    title:"",
    menus:[
      { name: "Inbox", icon: InboxIcon, current: true },
      { name: "Sent",icon: ReplyIcon, current: false },
      { name: "Draft",icon: PencilIcon, current: false },
      { name: "Starred",icon: StarIcon, current: false },
      { name: "Spam", icon: SparklesIcon, current: false },
      { name: "Trash", icon: TrashIcon, current: false },
    ]
  },
  {
    title:"Labels",
    menus:[
      { name: "Personal", icon: "dotIcon", iconColor: "green-dot", current: false },
      { name: "Company", icon: "dotIcon", iconColor: "blue-dot", current: false },
      { name: "Important", icon: "dotIcon", iconColor: "yellow-dot", current: false },
      { name: "Private", icon: "dotIcon", iconColor: "red-dot", current: false }
    ]
  }
]

const InboxPage: React.FC = () => {
  return (
    <>
      <Head>
        <title key="title">Court - Inbox</title>
      </Head>

      <DashboardLayout>
        <div className="min-h-screen">
          <div className="lg:grid lg:grid-cols-12">
            <aside className="xl:block xl:col-span-3 bg-white border-r border-gray-200">
              <div className="sticky top-6 space-y-4">
                <div className="flex-1 overflow-y-auto p-6">
                  <nav className="px-2 space-y-1">
                    <a
                      className={ "bg-indigo-600 text-white group block text-center py-2 text-base font-medium rounded-md items-center"}
                    >
                      Compose
                    </a>

                    {navigations.map(navigation => (
                      <div key={navigation.title}>
                      {!!navigation.title && <h3 className="text-lg leading-6 font-medium text-gray-900">{navigation.title}</h3>}
                        <div>
                        {
                          navigation.menus.map((menu) => (
                            <a
                              key={menu.name}
                              className={classNames(
                                menu.current ? "text-indigo-400" : " text-gray-400",
                                "group flex items-left py-2 text-base font-medium rounded-md "+(menu.icon == "dotIcon"?"menu-list-relative":"")
                              )}
                            >
                              {menu.icon != "dotIcon"?<menu.icon className="mr-4 flex-shrink-0 h-6 w-6 text-indigo-300" aria-hidden="true" />:<span className={"dont-icon "+ menu.iconColor}></span>}
                              {menu.name}
                            </a>
                          ))
                        }
                        </div>
                      </div>
                    ))}
                  </nav>
                </div>
              </div>
            </aside>
            <main className="lg:col-span-9 xl:col-span-9">
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <div className="flex-1 px-4 flex justify-between border-r border-gray-200">
                  <div className="flex-1 flex">
                    <form className="w-full flex md:ml-0" action="#" method="GET">
                      <label htmlFor="search-field" className="sr-only">
                        Search
                      </label>
                      <div className="relative w-full text-gray-400 focus-within:text-gray-600">
                        <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none">
                          <SearchIcon className="h-5 w-5" aria-hidden="true" />
                        </div>
                        <input
                          id="search-field"
                          className="block w-full h-full pl-8 pr-3 py-4 border-transparent text-gray-900 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-0 focus:border-transparent sm:text-sm"
                          placeholder="Search Mail"
                          type="search"
                          name="search"
                        />
                      </div>
                    </form>
                  </div>
                </div>
                <hr />
                <ul role="list" className="divide-y divide-gray-200">
                  <li>
                    <a className="block hover:bg-gray-50">
                      <div className="flex items-center px-4 py-4 sm:px-6">
                        <div className="min-w-0 flex-1 flex items-center">
                          <div className="flex-shrink-0">
                            <input
                              id="comments"
                              aria-describedby="comments-description"
                              name="comments"
                              type="checkbox"
                              className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                            />
                            &nbsp;&nbsp;
                          </div>
                          <div className="min-w-0 flex-1 px-4 md:grid md:grid-cols-2 md:gap-4">
                            <div>

                            </div>
                            <div className="hidden md:block">

                            </div>
                          </div>
                          <div>
                            <RefreshIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                          </div>
                          &nbsp;&nbsp;&nbsp;
                          <div>
                            <DotsVerticalIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                          </div>
                        </div>
                      </div>
                    </a>
                  </li>
                </ul>
                <hr />
                <ul role="list" className="divide-y divide-gray-200 max-height-400 overflow-y-auto">
                  {inboxes.map((inbox, i) => (
                    <li key={i}>
                      <a href={inbox.href} className="block hover:bg-gray-50">
                        <div className="flex items-center px-4 py-4 sm:px-6">
                          <div className="min-w-0 flex-1 flex items-center">
                            <div className="flex-shrink-0">
                              <input
                                id="comments"
                                aria-describedby="comments-description"
                                name="comments"
                                type="checkbox"
                                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                              />
                              &nbsp;&nbsp;
                            </div>
                            <div className="flex-shrink-0">
                              <img className="h-12 w-12 rounded-full" src={inbox.applicant.imageUrl} alt="" />
                            </div>
                            <div className="min-w-0 flex-1 px-4 md:grid md:grid-cols-2 md:gap-4">
                              <div>
                                <p className="text-sm font-medium text-indigo-600 truncate">{inbox.applicant.name}</p>
                                <p className="mt-2 flex items-center text-sm text-gray-500">
                                  <MailIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" aria-hidden="true" />
                                  <span className="truncate">{inbox.applicant.email}</span>
                                </p>
                              </div>
                              <div className="hidden md:block">
                                <div>
                                  <p className="text-sm text-gray-900">
                                    Applied on <time dateTime={inbox.date}>{inbox.dateFull}</time>
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div>
                            <ChevronRightIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                          </div>
                        </div>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </main>
          </div>
        </div>
      </DashboardLayout>
    </>
  )
}

export default InboxPage;