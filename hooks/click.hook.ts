import React, {
  useCallback,
  useRef,
} from 'react';

export function useDoubleClick<T = HTMLButtonElement>(
  doubleClick: React.MouseEventHandler<T>,
  click?: React.MouseEventHandler<T>,
  options?: any
) {
  options = {
    timeout: 200,
    ...options,
  };

  const clickTimeout = useRef<any>(null);

  const clearClickTimeout = () => {
    if (clickTimeout) {
      clearTimeout(clickTimeout.current);
      clickTimeout.current = null;
    }
  };

  return useCallback((event: React.MouseEvent<T>) => {
    clearClickTimeout();

    if (click && event.detail === 1) {
      clickTimeout.current = setTimeout(() => {
        click(event);
      }, options.timeout);
    }

    if ((event).detail % 2 === 0) {
      doubleClick(event);
    }
  }, [click, doubleClick, options.timeout]);
}