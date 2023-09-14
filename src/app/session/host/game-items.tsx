import { useLoggerContext } from "@/app/cairn-context";
import { EditGameItemDialog } from "@/components/cairn/edit-game-item-dialog";
import { NewGameItemDialog } from "@/components/cairn/new-game-item-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CardHeaderWithMenu } from "@/components/ui/card-header-with-menu";
import { DeleteMenuItem } from "@/components/ui/delete-menu-item";
import { GmContentMenuItems } from "@/components/ui/gm-content-menu-items";
import { MenuEntry } from "@/components/ui/menu-entry";
import { WeakEmph } from "@/components/ui/typography";
import { Gear, GearContent } from "@/lib/game/cairn/types";
import { ILens } from "@/lib/types";
import { getSubLens, uuidv4, getSubArrayLensById } from "@/lib/utils";
import { Share2Icon } from "lucide-react";
import { RandomEntryDialog } from "./random-entry-dialog";
import { BackLink } from "./back-link";
import { BaseCategory } from "@/lib/game/types";
import { SearchInput } from "@/components/ui/search-input";
import { useLens } from "@/lib/hooks";

interface GameItemHeaderProps {
  entryLens: ILens<GearContent>;
  itemsLens: ILens<GearContent[]>;
}

function GameItemHeader({ entryLens, itemsLens }: GameItemHeaderProps) {
  const log = useLoggerContext();
  const entry = entryLens.state;
  return (
    <CardHeaderWithMenu title={entry.name}>
      <MenuEntry>
        <EditGameItemDialog
          initialValue={entryLens.state}
          onSave={(g) => entryLens.setState(() => g)}
        />
      </MenuEntry>
      <MenuEntry>
        <Button
          className="flex gap-2 w-full"
          variant="ghost"
          size="xs"
          onClick={() =>
            log({
              kind: "chat-custom",
              type: "ItemShare",
              props: { item: entryLens.state },
            })
          }
        >
          <Share2Icon />
          <div className="flex-grow text-left">Share</div>
        </Button>
      </MenuEntry>
      <GmContentMenuItems lens={entryLens} categoryType="item" />
      <MenuEntry>
        <DeleteMenuItem collectionLens={itemsLens} entry={entry} type="item" />
      </MenuEntry>
    </CardHeaderWithMenu>
  );
}

interface AllNpcsProps {
  itemCategoryLens: ILens<BaseCategory<"item", Gear>>;
}

export function AllItems({ itemCategoryLens }: AllNpcsProps) {
  const itemsLens = getSubLens(itemCategoryLens, "entries");
  const searchLens = useLens("");
  const categoryName = itemCategoryLens.state.name;

  return (
    <div className="flex flex-col gap-2 items-start">
      <div className="flex flex-wrap gap-2 items-center">
        <BackLink />
        <NewGameItemDialog
          categoryName={categoryName}
          onCreate={(g) => {
            itemsLens.setState((d) => {
              d.push({
                ...g,
                excludedFromRandomPick: false,
                privateNotes: "",
                visibleToAll: false,
                id: uuidv4(),
              });
            });
          }}
        />
        <RandomEntryDialog lens={itemsLens} name={categoryName} />
        <SearchInput lens={searchLens} />
      </div>
      {itemsLens.state.length > 20 && (
        <WeakEmph>Results limited to the first 20 entries</WeakEmph>
      )}
      {itemsLens.state.length === 0 && <WeakEmph>No {categoryName} defined</WeakEmph>}
      {itemsLens.state.length > 0 && (
        <>
          <div className="flex flex-wrap w-full gap-2">
            {itemsLens.state
              .filter((i) =>
                i.name.toLowerCase().includes(searchLens.state.toLowerCase())
              )
              .toSorted((a, b) => a.name.localeCompare(b.name))
              .slice(0, 20)
              .map((item) => {
                const itemLens = getSubArrayLensById(itemsLens, item.id);
                return (
                  <Card key={item.id} className="max-w-xs w-full">
                    <GameItemHeader
                      itemsLens={itemsLens}
                      entryLens={itemLens}
                    />
                    <CardContent>
                      <div>{item.description}</div>
                      <WeakEmph>{item.privateNotes}</WeakEmph>
                    </CardContent>
                  </Card>
                );
              })}
          </div>
        </>
      )}
    </div>
  );
}
