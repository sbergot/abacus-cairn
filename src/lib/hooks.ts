import { useMemo } from "react";
import { uuidv4 } from "./utils";
import useLocalStorage from "use-local-storage";
import { Draft, produce } from "immer";
import { useGameContext } from "./gameContext";
import { usePathname } from "next/navigation";

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
  const [value, setValue] = useLocalStorage(key, defaultValue, { syncData: true });
  function setImmerValue(recipe: (v: Draft<T>) => void): void {
    setValue((oldVal: T | undefined) =>
      produce<T>(oldVal ?? defaultValue, (d) => recipe(d))
    );
  }
  return [value, setImmerValue];
}

export function useCharacterStorage<TChar>() {
  const { gameName } = useGameContext();
  return useImmerLocalStorage<Record<string, TChar>>(
    `${gameName}-characters`,
    {}
  );
}

export function useRelativeLinker() {
  const pathName = usePathname();
  return (path: string) => `${pathName}/${path}`;
}

export function useImportExport(key: string) {
  const { gameName } = useGameContext();
  const storageKey = `${gameName}-${key}`;

  function download() {
    const filename = `${storageKey}.json`;
    const text = localStorage[storageKey];
    const element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:text/plain;charset=utf-8," + encodeURIComponent(text)
    );
    element.setAttribute("download", filename);

    element.style.display = "none";
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  }

  function mergeData(body: string) {
    const importedData = JSON.parse(body) as object;
    const storedData = JSON.parse(localStorage[storageKey]) as object;
    const mergedData = { ...storedData, ...importedData };
    return mergedData;
  }

  return { download, mergeData };
}
