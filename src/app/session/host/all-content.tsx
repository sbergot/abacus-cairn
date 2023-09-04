import { useCurrentGame, useLoggerContext } from "@/app/cairn-context";
import { CharacterCollection } from "@/components/cairn/character-collection";
import { EditCustomEntryDialog } from "@/components/ui/edit-custom-entry-dialog";
import { EditGameItemDialog } from "@/components/cairn/edit-game-item-dialog";
import { NewCharacterDialog } from "@/components/cairn/new-character-dialog";
import { NewCustomEntryDialog } from "@/components/ui/new-custom-entry-dialog";
import { NewGameItemDialog } from "@/components/cairn/new-game-item-dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ButtonLike } from "@/components/ui/button-like";
import { Card, CardContent } from "@/components/ui/card";
import { DeleteAlert } from "@/components/ui/delete-alert";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { MenuEntry } from "@/components/ui/menu-entry";
import TextAreaField from "@/components/ui/textareafield";
import { TooltipShort } from "@/components/ui/tooltip-short";
import { WeakEmph } from "@/components/ui/typography";
import { CairnCharacter, CairnNpc, GearContent } from "@/lib/game/cairn/types";
import { CustomCategory, CustomEntry } from "@/lib/game/types";
import { ILens } from "@/lib/types";
import {
  getSubArrayLens,
  getSubLens,
  getSubRecordLens,
  uuidv4,
} from "@/lib/utils";
import { Draft } from "immer";
import { FolderPlusIcon, Share2Icon, Trash2Icon } from "lucide-react";
import { useState } from "react";
import { RandomEntryDialog } from "./random-entry-dialog";
import { CardHeaderWithMenu } from "@/components/ui/card-header-with-menu";
import { GmContentMenuItems } from "@/components/ui/gm-content-menu-items";
import { DeleteMenuItem } from "@/components/ui/delete-menu-item";
import { ManageCustomItems } from "./manage-custom-items";

export function AllContent() {
  const gameLens = useCurrentGame();
  const customEntriesLens = getSubLens(gameLens, "customEntries");

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        <NewCategoryDialog
          onCreate={(name) =>
            gameLens.setState((d) => {
              d.customEntries.push({
                id: uuidv4(),
                name,
                description: "",
                entries: [],
              });
            })
          }
        />
        <ManageCustomItems />
      </div>
      <Accordion
        type="multiple"
        className="w-full"
        defaultValue={[
          "npcs",
          "items",
          ...Object.keys(gameLens.state.customEntries),
        ]}
      >
        <AccordionItem value="npcs">
          <AccordionTrigger>NPCs</AccordionTrigger>
          <AccordionContent>
            <AllNpcs />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="items">
          <AccordionTrigger>Items</AccordionTrigger>
          <AccordionContent>
            <AllItems />
          </AccordionContent>
        </AccordionItem>
        {customEntriesLens.state.map((category, idx) => {
          const categoryLens = getSubArrayLens(customEntriesLens, idx);
          const entriesLens = getSubLens(categoryLens, "entries");
          return (
            <AccordionItem key={category.id} value={category.name}>
              <AccordionTrigger>{category.name}</AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col items-start gap-2">
                  <div className="flex flex-wrap gap-2">
                    <NewCustomEntryDialog
                      onCreate={(ce) =>
                        categoryLens.setState((d) => {
                          d.entries.push(ce);
                        })
                      }
                    />
                    <RandomEntryDialog
                      lens={entriesLens}
                      name={categoryLens.state.name}
                    />
                    <DeleteAlert
                      icon={
                        <Button>
                          <Trash2Icon /> Delete category
                        </Button>
                      }
                      onConfirm={() =>
                        gameLens.setState((d) => {
                          d.customEntries = d.customEntries.filter(
                            (e) => e.id !== category.id
                          );
                        })
                      }
                    >
                      This will permanently delete this category and all its
                      items
                    </DeleteAlert>
                  </div>
                  <div className="flex flex-wrap gap-2 w-full">
                    {categoryLens.state.entries.map((entry, idx) => {
                      const entriesLens = getSubLens(categoryLens, "entries");
                      const entryLens = getSubArrayLens(entriesLens, idx);
                      return (
                        <Card key={entry.id} className="max-w-xs w-full">
                          <CustomEntryHeader
                            categoryLens={categoryLens}
                            entryLens={entryLens}
                          />
                          <CardContent>
                            <div>{entry.description}</div>
                            <WeakEmph>{entry.privateNotes}</WeakEmph>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}

interface CustomEntryHeaderProps {
  entryLens: ILens<CustomEntry>;
  categoryLens: ILens<CustomCategory>;
}

function CustomEntryHeader({
  entryLens,
  categoryLens,
}: CustomEntryHeaderProps) {
  const category = categoryLens.state.name;
  const entriesLens = getSubLens(categoryLens, "entries");
  const entry = entryLens.state;
  return (
    <CardHeaderWithMenu title={entry.name}>
      <MenuEntry>
        <EditCustomEntryDialog lens={entryLens} title={`Edit ${category}`} />
      </MenuEntry>
      <GmContentMenuItems lens={entryLens} />
      <MenuEntry>
        <DeleteMenuItem
          collectionLens={entriesLens}
          entry={entry}
          type={category}
        />
      </MenuEntry>
    </CardHeaderWithMenu>
  );
}

interface NewCategoryDialogProps {
  onCreate(name: string): void;
}

function NewCategoryDialog({ onCreate }: NewCategoryDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <ButtonLike>
          <FolderPlusIcon className="mr-2" /> New custom category
        </ButtonLike>
      </DialogTrigger>
      <DialogContent>
        <div>Name</div>
        <Input value={name} onChange={(e) => setName(e.target.value)} />
        <Button
          onClick={() => {
            onCreate(name);
            setOpen(false);
          }}
        >
          create
        </Button>
      </DialogContent>
    </Dialog>
  );
}

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

function AllNpcs() {
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
      <GmContentMenuItems lens={entryLens} />
      <MenuEntry>
        <DeleteMenuItem collectionLens={itemsLens} entry={entry} type="item" />
      </MenuEntry>
    </CardHeaderWithMenu>
  );
}

function AllItems() {
  const gameLens = useCurrentGame();
  const itemsLens = getSubLens(gameLens, "items");

  return (
    <div className="flex flex-col gap-2 items-start">
      <div className="flex gap-2">
        <NewGameItemDialog
          onCreate={(g) => {
            gameLens.setState((d) => {
              d.items.push({
                ...g,
                excludedFromRandomPick: false,
                privateNotes: "",
                visibleToAll: false,
              });
            });
          }}
        />
        <RandomEntryDialog lens={itemsLens} name="item" />
      </div>
      {itemsLens.state.length === 0 && <div>No item defined</div>}
      {itemsLens.state.length > 0 && (
        <div className="flex flex-wrap w-full gap-2">
          {itemsLens.state.map((item, idx) => {
            const itemLens = getSubArrayLens(itemsLens, idx);
            return (
              <Card key={item.id} className="max-w-xs w-full">
                <GameItemHeader itemsLens={itemsLens} entryLens={itemLens} />
                <CardContent>
                  <div>{item.description}</div>
                  <WeakEmph>{item.privateNotes}</WeakEmph>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
