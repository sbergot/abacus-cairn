"use client"

import { Children } from "./types";

export default function Wrapper({ children }: Children) {
  if (global.window === undefined) {
    return <div />
  }
  return <>{children}</>;
}
