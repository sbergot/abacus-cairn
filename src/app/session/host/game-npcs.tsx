import { useLoggerContext, useCurrentGame } from "@/app/cairn-context";
import { CharacterCollection } from "@/components/cairn/character-collection";
import { NewCharacterDialog } from "@/components/cairn/new-character-dialog";
import { Button } from "@/components/ui/button";
import { GmContentMenuItems } from "@/components/ui/gm-content-menu-items";
import { MenuEntry } from "@/components/ui/menu-entry";
import TextAreaField from "@/components/ui/textareafield";
import { TooltipShort } from "@/components/ui/tooltip-short";
import { WeakEmph } from "@/components/ui/typography";
import { CairnNpc, CairnCharacter } from "@/lib/game/cairn/types";
import { ILens } from "@/lib/types";
import { getSubLens } from "@/lib/utils";
import { Draft } from "immer";
import { Share2Icon } from "lucide-react";
import { RandomEntryDialog } from "./random-entry-dialog";

function NpcTools({ characterLens }: { characterLens: ILens<CairnNpc> }) {
  const log = useLoggerContext();
  return (
    <>
      <GmContentMenuItems lens={characterLens} />
      <MenuEntry>
        <Button
          size="icon-sm"
          variant="ghost"
          className="flex gap-2 w-full"
          onClick={() =>
            log({
              kind: "chat-custom",
              type: "NpcShare",
              props: { npc: characterLens.state },
            })
          }
        >
          <Share2Icon />
          <div className="flex-grow text-left">Share</div>
        </Button>
      </MenuEntry>
      <TooltipShort name="share"></TooltipShort>
    </>
  );
}

function NpcEdit({ characterLens }: { characterLens: ILens<CairnNpc> }) {
  return (
    <div>
      <div>Private notes</div>
      <TextAreaField lens={characterLens} fieldName="privateNotes" />
    </div>
  );
}

function NpcDetails({ characterLens }: { characterLens: ILens<CairnNpc> }) {
  return <WeakEmph>{characterLens.state.privateNotes}</WeakEmph>;
}

function newNpc(char: CairnCharacter): CairnNpc {
  const newNpc: CairnNpc = {
    ...char,
    visibleToAll: false,
    excludedFromRandomPick: false,
    privateNotes: "",
  };
  return newNpc;
}

export function AllNpcs() {
  const gameLens = useCurrentGame();
  const npcsLens = getSubLens(gameLens, "npcs");
  return (
    <div className="flex flex-col gap-2 items-start">
      <div className="flex gap-2">
        <NewCharacterDialog
          charType="npc"
          onCreate={(c) => {
            npcsLens.setState((d) => {
              d.push(newNpc(c) as Draft<CairnNpc>);
            });
          }}
        />
        <RandomEntryDialog lens={npcsLens} name="npc" />
      </div>
      {npcsLens.state.length === 0 && <div>No NPC defined</div>}
      {npcsLens.state.length > 0 && (
        <CharacterCollection<CairnNpc>
          charType="npc"
          lens={npcsLens}
          HeaderMenu={NpcTools}
          Edit={NpcEdit}
          Details={NpcDetails}
        />
      )}
    </div>
  );
}
