// For solving @headlessui/react only
// should we change this component name?

import Link from "next/link";
import React, { forwardRef } from "react";
import { UrlObject } from "url";

interface Props extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  children: React.ReactNode;
  href: string | UrlObject;
}

export const MenuLink: React.ForwardRefExoticComponent<Props> = forwardRef<any, Props>((props, ref) => {
  const { href, children, ...rest } = props;

  return (
    <Link href={href}>
      <a ref={ref} {...rest}>
        {children}
      </a>
    </Link>
  )
})

MenuLink.displayName = "MenuLink"
