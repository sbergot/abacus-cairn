import { Draft } from "immer";

export interface IUseStateContext<T> {
  state: T;
  setState(r: (d: Draft<T>) => void): void;
}
