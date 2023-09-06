import { Draft } from "immer";

export interface ILens<T> {
  state: T;
  setState: Setter<T>;
}

export type Setter<T> = (r: (d: Draft<T>) => Draft<T> | T | void) => void
