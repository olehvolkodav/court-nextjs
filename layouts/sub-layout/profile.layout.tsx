import { classNames } from "@/utils/classname";
import React, { useMemo } from "react";
import {
  CreditCardIcon,
  KeyIcon,
  UserCircleIcon,
} from "@heroicons/react/outline"
import { NextLink } from "@/components/ui/link";
import { getStripe } from "@/plugins/stripe";
import { Elements } from "@stripe/react-stripe-js";
import { useRouter } from "next/router";
import { useStore } from "effector-react";
import { $user } from "@/store/auth.store";

const stripePromise = getStripe();

export const ProfileLayout: React.FC<{children: React.ReactNode}> = ({children}) => {
  const user = useStore($user);

  const subNavigation = useMemo(() => {
    const nav = [
      { name: "Profile", pathname: "profile", icon: UserCircleIcon},
      { name: "Password", pathname: "profile/password", icon: KeyIcon},
    ];

    if (user?.hasCustomer) {
      nav.push({ name: "Billing", pathname: "profile/billing", icon: CreditCardIcon},)
    }

    return nav;
  }, [user?.hasCustomer]);

  const router = useRouter();

  return (
    <div className="py-4">
      <div className="container px-4 mx-auto">
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-5">
          <aside className="py-6 px-2 sm:px-6 lg:py-0 lg:px-0 lg:col-span-3">
            <nav className="space-y-1">
              {subNavigation.map((item) => (
                <NextLink
                  href={`/dashboard/${router.query.case}/${item.pathname}`}
                  key={item.name}
                  activeClassName="bg-gray-50 text-orange-600"
                  passiveClassName="text-gray-900 hover:text-gray-900"
                >
                  <a className="group rounded-md px-3 py-2 flex items-center text-sm font-medium hover:bg-white">
                    <item.icon
                      className={classNames(
                        "flex-shrink-0 -ml-1 mr-3 h-6 w-6",
                        "text-gray-400 group-hover:text-gray-500"
                      )}
                      aria-hidden="true"
                    />
                    <span className="truncate">{item.name}</span>
                  </a>
                </NextLink>
              ))}
            </nav>
          </aside>

          <div className="sm:px-6 lg:px-0 lg:col-span-9">
            <Elements stripe={stripePromise}>
              {children}
            </Elements>
          </div>
        </div>
      </div>
    </div>
  )
}
