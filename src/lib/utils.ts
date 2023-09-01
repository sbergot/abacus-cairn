import { type ClassValue, clsx } from "clsx";
import { Draft } from "immer";
import { twMerge } from "tailwind-merge";
import { WithId } from "./game/types";
import { ILens } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
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
  const result = JSON.parse(JSON.stringify(e)) as T;
  result.id = uuidv4();
  return result;
}

export function download(storageKey: string) {
  const filename = `${storageKey}.json`;
  const text = localStorage[storageKey];
  downLoadText(filename, text);
}

export function downloadJson(name: string, data: object) {
  const filename = `${name}.json`;
  const text = JSON.stringify(data, null, 2);
  downLoadText(filename, text);
}

function downLoadText(filename: string, text: string) {
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

export function setSingle<T>(
  setRepo: (r: (d: Draft<Record<string, T>>) => void) => void,
  key: string
) {
  function setter(setEntry: (d: Draft<T>) => void) {
    setRepo((r) => setEntry(r[key]));
  }
  return setter;
}

export function getSubLens<T, K extends keyof T>(
  lens: ILens<T>,
  key: K
): ILens<T[K]> {
  return {
    state: lens.state[key],
    setState: (recipe) => lens.setState((d) => {
      const result = recipe((d as any)[key]);
      if (result !== undefined) {
        (d as any)[key] = result as any;
      }
    }),
  };
}

export function getSubArrayLens<T>(
  lens: ILens<T[]>,
  key: number
): ILens<T> {
  return {
    state: lens.state[key],
    setState: (recipe) => lens.setState((d) => {
      const result = recipe(d[key]);
      if (result !== undefined) {
        d[key] = result as any;
      }
    }),
  };
}

export function getSubRecordLens<T>(
  lens: ILens<Record<string, T>>,
  key: string
): ILens<T> {
  return {
    state: lens.state[key],
    setState: (recipe) => lens.setState((d) => {
      const result = recipe(d[key]);
      if (result !== undefined) {
        d[key] = result as any;
      }
    }),
  };
}

export function countBy<T>(list: T[], select: (o: T) => string): Record<string, number> {
  const result: Record<string, number> = {};
  for (const o of list) {
      const key = select(o);
      if (result[key] === undefined) {
          result[key] = 0;
      }
      result[key] += 1;
  }
  return result;
}
