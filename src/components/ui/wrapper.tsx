import { Children } from "./types";

if (global.navigator === undefined) {
  global.navigator = { clipboard: {} as any } as any;
}

export default function Wrapper({ children }: Children) {
  return <>{children}</>;
}
