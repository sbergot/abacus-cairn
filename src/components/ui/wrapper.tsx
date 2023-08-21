import { useEffect } from "react";
import { Children } from "./types";

export default function Wrapper({ children }: Children) {
  useEffect(() => {
    if (global.navigator === undefined) {
      global.navigator = { clipboard: {} as any } as any;
    }
  }, []);
  return <>{children}</>;
}
