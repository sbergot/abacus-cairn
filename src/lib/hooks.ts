import { useMemo } from "react";
import { uuidv4 } from "./utils";
import useLocalStorage from "use-local-storage";
import { Draft, produce } from "immer";

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

export function useImmerLocalStorage<T>(key: string, defaultValue: T): [T, (r: (d:Draft<T>) => void) => void ] {
  const [value, setValue] = useLocalStorage(key, defaultValue);
  function setImmerValue(recipe: (v: Draft<T>) => void): void {
    setValue((oldVal: T | undefined) =>
      produce<T>(oldVal ?? defaultValue, (d) => recipe(d))
    );
  }
  return [value, setImmerValue];
}
