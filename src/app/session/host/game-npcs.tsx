import { useLoggerContext } from "@/app/cairn-context";
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
import { BackLink } from "./back-link";
import { BaseCategory } from "@/lib/game/types";
import { SearchInput } from "@/components/ui/search-input";
import { useLens } from "@/lib/hooks";

function NpcTools({ characterLens }: { characterLens: ILens<CairnNpc> }) {
  const log = useLoggerContext();
  return (
    <>
      <GmContentMenuItems lens={characterLens} categoryType="character" />
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

interface AllNpcsProps {
  charCategoryLens: ILens<BaseCategory<"character", CairnCharacter>>;
}

export function AllNpcs({ charCategoryLens }: AllNpcsProps) {
  const entriesLens = getSubLens(charCategoryLens, "entries");
  const searchLens = useLens("");
  const categoryName = charCategoryLens.state.name;
  return (
    <div className="flex flex-col gap-2 items-start">
      <div className="flex flex-wrap items-center gap-2">
        <BackLink />
        <NewCharacterDialog
          charType={categoryName}
          onCreate={(c) => {
            entriesLens.setState((d) => {
              d.push(newNpc(c) as Draft<CairnNpc>);
            });
          }}
        />
        <RandomEntryDialog lens={entriesLens} name={categoryName} />
        <SearchInput lens={searchLens} />
      </div>
      {entriesLens.state.length === 0 && (
        <WeakEmph>No {categoryName} defined</WeakEmph>
      )}
      {entriesLens.state.length > 0 && (
        <>
          <CharacterCollection<CairnNpc>
            charType={categoryName}
            lens={entriesLens}
            searchFilter={searchLens.state}
            HeaderMenu={NpcTools}
            Edit={NpcEdit}
            Details={NpcDetails}
          />
        </>
      )}
    </div>
  );
}
