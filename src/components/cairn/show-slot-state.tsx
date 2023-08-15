import { SlotState } from "@/lib/game/cairn/types";
import { WeakEmph } from "../ui/typography";
import { ShowGear } from "./show-gear";

interface ShowSlotStateProps {
  state: SlotState;
}

export function ShowSlotState({ state }: ShowSlotStateProps) {
  if (state.type === "empty") {
    return <WeakEmph>empty</WeakEmph>;
  }

  if (state.type === "fatigue") {
    return <WeakEmph>fatigue</WeakEmph>;
  }

  if (state.type === "bulky") {
    return <WeakEmph>{state.name}</WeakEmph>;
  }

  return <ShowGear gear={state.gear} />;
}
