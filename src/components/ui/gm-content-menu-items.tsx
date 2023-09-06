import { EyeIcon, EyeOffIcon, XCircle, CheckCircle2Icon } from "lucide-react";
import { Button } from "./button";
import { MenuEntry } from "./menu-entry";
import { ILens } from "@/lib/types";
import { GmContent } from "@/lib/game/types";

interface Props<T> {
  lens: ILens<T>;
}

export function GmContentMenuItems<T extends GmContent>({ lens }: Props<T>) {
  return (
    <>
      <MenuEntry>
        <Button
          variant="ghost"
          className="flex items-center gap-2 w-full"
          size="icon-sm"
          onClick={() =>
            lens.setState((d) => {
              d.visibleToAll = !d.visibleToAll;
            })
          }
        >
          {lens.state.visibleToAll ? <EyeIcon /> : <EyeOffIcon />}
          <div className="flex-grow text-left">
            {lens.state.visibleToAll
              ? "Make invisible to players"
              : "Make visible to players"}
          </div>
        </Button>
      </MenuEntry>
      <MenuEntry>
        <Button
          variant="ghost"
          size="icon-sm"
          className="flex items-center gap-2 w-full"
          onClick={() =>
            lens.setState((d) => {
              d.excludedFromRandomPick = !d.excludedFromRandomPick;
            })
          }
        >
          {lens.state.excludedFromRandomPick ? (
            <XCircle />
          ) : (
            <CheckCircle2Icon />
          )}
          <div className="flex-grow text-left">
            {lens.state.excludedFromRandomPick
              ? "Include in random pick"
              : "Exclude from random pick"}
          </div>
        </Button>
      </MenuEntry>
    </>
  );
}
