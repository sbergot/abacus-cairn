import { useMemo } from "react";
import { uuidv4 } from "./utils";
import useLocalStorage from "use-local-storage";
import { Draft, produce } from "immer";
import { usePathname, useSearchParams } from "next/navigation";

export function useBrowserId(): string {
  return useMemo(() => {
    const key = "browser_id";
    const cached = localStorage.getItem(key);
    if (cached) {
      return cached;
    }
    const newId = uuidv4();
    localStorage.setItem(key, newId);
    return newId;
  }, []);
}

export function useImmerLocalStorage<T>(
  key: string,
  defaultValue: T
): [T, (r: (d: Draft<T>) => void) => void] {
  const [value, setValue] = useLocalStorage(key, defaultValue, {
    syncData: true,
  });
  function setImmerValue(recipe: (v: Draft<T>) => void): void {
    setValue((oldVal: T | undefined) =>
      produce<T>(oldVal ?? defaultValue, (d) => recipe(d))
    );
  }
  return [value, setImmerValue];
}

export function useRelativeLinker() {
  const pathName = usePathname();
  return (path: string, searchParams: Record<string, string> | null = null) => {
    const querystring =
      searchParams === null
        ? ""
        : `?${Object.entries(searchParams)
            .map(([k, v]) => `${k}=${v}`)
            .join("&")}`;
    return `${pathName}/${path}${querystring}`;
  };
}

export function useUrlParams(): Record<string, string> {
  const searchParams = Array.from(useSearchParams().entries());
  const result: Record<string, string> = {};
  searchParams.forEach(([key, value]) => {
    result[key] = value;
  });
  return result;
}
