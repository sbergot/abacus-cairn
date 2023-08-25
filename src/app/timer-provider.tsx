import { Children } from "@/components/ui/types";
import { useTickingTimers } from "@/lib/hooks";

export function TimerProvider({ children }: Children) {
  useTickingTimers();
  return <>{children}</>;
}
