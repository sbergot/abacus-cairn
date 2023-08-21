import { Children } from "./types";

export default function Wrapper({ children }: Children) {
  if (window === undefined) {
    return <div />
  }
  return <>{children}</>;
}
