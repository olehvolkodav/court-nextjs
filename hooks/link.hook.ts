import { UrlObject } from 'url';
import { useCallback } from 'react';
import { toQueryString } from '@/utils/url';
import { useRouter } from 'next/router'

export const useLink = () => {
  const { asPath, pathname } = useRouter();

  const isRouteActive = useCallback((path: string, exact = false) => {
    const hrefToString = (href: string | UrlObject) => {
      if (typeof href === 'string') {
        return href;
      }

      let hrefString = href.pathname;

      if (exact && href.query) {
        hrefString += toQueryString(href.query)
      }

      return hrefString;
    }

    const linkPath = hrefToString(path);

    return linkPath === (exact ? asPath : pathname)
  }, [asPath, pathname]);

  return { isRouteActive }
}