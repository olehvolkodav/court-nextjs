import React, { useState, useEffect, Children } from "react"
import { useRouter } from "next/router"
import Link, { LinkProps } from "next/link"
import { UrlObject } from "url";
import { toQueryString } from "@/utils/url";
import { classNames } from "@/utils/classname";

interface Props extends LinkProps {
  children: React.ReactElement;
  activeClassName?: string;
  passiveClassName?: string; //should change this props with simpler name
  exact?: boolean;
}

export const NextLink: React.FC<Props> = ({ children, activeClassName, passiveClassName, exact, ...props }) => {
  const { asPath, pathname, isReady } = useRouter();

  const child = Children.only(children)
  const childClassName = child.props.className || ""
  const [className, setClassName] = useState(childClassName);

  const hrefToString = React.useCallback((href: string | UrlObject) => {
    if (typeof href === "string") {
      return href;
    }

    let hrefString = href.pathname;

    if (exact && href.query) {
      hrefString += toQueryString(href.query);
    }

    return hrefString;
  }, [exact])

  const isActive = React.useMemo(() => {
    const linkPath = hrefToString(props.href);
    return linkPath === (exact ? asPath : pathname);
  }, [asPath, props.href, hrefToString, pathname, exact]);

  useEffect(() => {
    // Check if the router fields are updated client-side
    if (isReady) {
      const newClassName = isActive
          ? classNames(activeClassName, childClassName)
          : classNames(passiveClassName, childClassName)

      if (newClassName !== className) {
        setClassName(newClassName)
      }
    }
  }, [
    asPath,
    isReady,
    props.as,
    props.href,
    childClassName,
    activeClassName,
    setClassName,
    className,
    isActive,
    passiveClassName
  ])

  return (
    <Link {...props} passHref>
      {React.cloneElement(child, {
        className: className || null,
      })}
    </Link>
  )
}

NextLink.defaultProps = {
  activeClassName: "active",
  exact: false,
}
