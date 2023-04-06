import { classNames } from "@/utils/classname";
import React from "react";
import {
  ColorSwatchIcon,
  CubeIcon,
} from '@heroicons/react/outline'
import { NextLink } from "@/components/ui/link";

const subNavigation = [
  { name: 'General', href: '/', icon: CubeIcon},
];

export const SettingLayout: React.FC<{children: React.ReactNode}> = ({children}) => {
  return (
    <div className="py-4">
      <div className="container px-4 mx-auto">
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-5">
          <aside className="py-6 px-2 sm:px-6 lg:py-0 lg:px-0 lg:col-span-3">
            <nav className="space-y-1">
              {subNavigation.map((item) => (
                <NextLink
                  href={`/super-admin${item.href}`}
                  key={item.name}
                  activeClassName="bg-gray-50 text-orange-600"
                  passiveClassName="text-gray-900 hover:text-gray-900"
                >
                  <a className="group rounded-md px-3 py-2 flex items-center text-sm font-medium hover:bg-white">
                    <item.icon
                      className={classNames(
                        'flex-shrink-0 -ml-1 mr-3 h-6 w-6',
                        'text-gray-400 group-hover:text-gray-500'
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
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
