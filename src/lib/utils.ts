import { type ClassValue, clsx } from "clsx"
import { Draft } from "immer";
import { twMerge } from "tailwind-merge"
import { WithId } from "./game/types";
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function uuidv4(): string {
  return (([1e7] as any) + -1e3 + -4e3 + -8e3 + -1e11).replace(
    /[018]/g,
    (c: any) =>
      (
        c ^
        (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
      ).toString(16)
  );
}

export function clone<T extends WithId>(e: T): T {
  return { ...e, id: uuidv4() };
}

export function download(storageKey: string) {
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

export function setSingle<T>(setRepo: (r: (d: Draft<Record<string, T>>) => void) => void, key: string) {
  function setter(setEntry: (d: Draft<T>) => void) {
    setRepo(r => setEntry(r[key]))
  }
  return setter;
}