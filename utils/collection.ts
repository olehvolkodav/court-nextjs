import { isUnset } from "./mix";

type SumFunction<T = any[]> = (a: any, b: any) => T;

export function $collect<T = any[]>(items: any[]) {
  return {
    unique(fn: Function): T {
      return items.reduce((prev, curr) => {
        if (!prev.some((x: any) => fn(curr, x))) prev.push(curr);
        return prev;
      }, []);
    },
    sum(keyOrFunction?: string | SumFunction<T>): number {
      if (isUnset(items)) {
        return 0;
      }

      if (!keyOrFunction) {
        return items.reduce((acc, val) => acc + val, 0)
      }

      return items.map(typeof keyOrFunction === 'function' ? keyOrFunction : val => val[keyOrFunction])
        .reduce((acc, val) => acc + val, 0);
    }
  }
}

export function isObjectEmpty(obj: Record<string, any> = {}) {
  return JSON.stringify(obj) === '{}';
}
