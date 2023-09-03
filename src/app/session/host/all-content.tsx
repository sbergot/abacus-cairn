import { useCurrentGame, useLoggerContext } from "@/app/cairn-context";
import { CharacterCollection } from "@/components/cairn/character-collection";
import { EditCustomEntryDialog } from "@/components/cairn/edit-custom-entry-dialog";
import { EditGameItemDialog } from "@/components/cairn/edit-game-item-dialog";
import { NewCharacterDialog } from "@/components/cairn/new-character-dialog";
import { NewCustomEntryDialog } from "@/components/cairn/new-custom-entry-dialog";
import { NewGameItemDialog } from "@/components/cairn/new-game-item-dialog";
import { TitleWithIcons } from "@/components/cairn/title-with-icons";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ButtonLike } from "@/components/ui/button-like";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CardMenu } from "@/components/ui/card-menu";
import { DeleteAlert } from "@/components/ui/delete-alert";
import {
  Dialog,
  DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { MenuEntry } from "@/components/ui/menu-entry";
import TextAreaField from "@/components/ui/textareafield";
import { TooltipShort } from "@/components/ui/tooltip-short";
import { WeakEmph } from "@/components/ui/typography";
import { CairnCharacter, CairnNpc, GearContent } from "@/lib/game/cairn/types";
import { CustomEntry } from "@/lib/game/types";
import { ILens } from "@/lib/types";
import { getSubArrayLens, getSubLens, getSubRecordLens } from "@/lib/utils";
import { Draft } from "immer";
import {
  CheckCircle2Icon,
  EyeIcon,
  EyeOffIcon,
  FolderPlusIcon,
  Share2Icon,
  Trash2Icon,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { RandomEntryDialog } from "./random-entry-dialog";

export function AllContent() {
  const gameLens = useCurrentGame();
  const customEntriesLens = getSubLens(gameLens, "customEntries");

  return (
    <div>
      <NewCategoryDialog
        onCreate={(name) =>
          gameLens.setState((d) => {
            d.customEntries[name] = [];
          })
        }
      />
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
        {Object.keys(customEntriesLens.state).map((category) => {
          const categoryLens = getSubRecordLens(customEntriesLens, category);
          return (
            <AccordionItem key={category} value={category}>
              <AccordionTrigger>{category}</AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col items-start gap-2">
                  <div className="flex flex-wrap gap-2">
                    <NewCustomEntryDialog
                      onCreate={(ce) =>
                        gameLens.setState((d) => {
                          d.customEntries[category].push(ce);
                        })
                      }
                    />
                    <RandomEntryDialog lens={categoryLens} name={category} />
                    <DeleteAlert
                      icon={
                        <Button>
                          <Trash2Icon /> Delete category
                        </Button>
                      }
                      onConfirm={() =>
                        gameLens.setState((d) => {
                          delete d.customEntries[category];
                        })
                      }
                    >
                      This will permanently delete this category and all its
                      items
                    </DeleteAlert>
                  </div>
                  <div className="flex flex-wrap gap-2 w-full">
                    {categoryLens.state.map((entry, idx) => {
                      const entryLens = getSubArrayLens(categoryLens, idx);
                      return (
                        <Card key={entry.id} className="max-w-xs w-full">
                          <CustomEntryHeader
                            categoryLens={categoryLens}
                            entryLens={entryLens}
                            category={category}
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
  categoryLens: ILens<CustomEntry[]>;
  category: string;
}

function CustomEntryHeader({
  entryLens,
  categoryLens,
  category,
}: CustomEntryHeaderProps) {
  const entry = entryLens.state;
  return (
    <CardHeader className="flex justify-between flex-row items-center gap-0">
      <CardTitle className="flex-grow">{entry.name}</CardTitle>
      <CardMenu>
        <MenuEntry>
          <EditCustomEntryDialog lens={entryLens} title={`Edit ${category}`} />
        </MenuEntry>
        <MenuEntry>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() =>
              categoryLens.setState((d) => {
                const entryToEdit = d.find((e) => e.id === entry.id)!;
                entryToEdit.visibleToAll = !entryToEdit.visibleToAll;
              })
            }
          >
            {entry.visibleToAll ? <EyeIcon /> : <EyeOffIcon />}
          </Button>
          {entry.visibleToAll
            ? "Make invisible to players"
            : "Make visible to players"}
        </MenuEntry>
        <MenuEntry>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() =>
              categoryLens.setState((d) => {
                const entryToEdit = d.find((e) => e.id === entry.id)!;
                entryToEdit.excludedFromRandomPick =
                  !entryToEdit.excludedFromRandomPick;
              })
            }
          >
            {entry.excludedFromRandomPick ? <XCircle /> : <CheckCircle2Icon />}
          </Button>
          {entry.excludedFromRandomPick
            ? "Include in random pick"
            : "Exclude from random pick"}
        </MenuEntry>
        <MenuEntry>
          <DeleteAlert
            icon={
              <ButtonLike
                variant="ghost"
                size="xs"
                className="flex gap-2 w-full"
              >
                <Trash2Icon />
                <div className="flex-grow text-left">Delete</div>
              </ButtonLike>
            }
            onConfirm={() =>
              categoryLens.setState((d) => d.filter((e) => e.id !== entry.id))
            }
          >
            This will permanently delete this entry
          </DeleteAlert>
        </MenuEntry>
      </CardMenu>
    </CardHeader>
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
      <MenuEntry>
        <Button
          variant="ghost"
          size="xs"
          onClick={() =>
            characterLens.setState((d) => {
              d.visibleToAll = !d.visibleToAll;
            })
          }
        >
          {characterLens.state.visibleToAll ? (
            <EyeIcon className="mr-2" />
          ) : (
            <EyeOffIcon className="mr-2" />
          )}
          {characterLens.state.visibleToAll
            ? "Make invisible to players"
            : "Make visible to players"}
        </Button>
      </MenuEntry>
      <MenuEntry>
        <Button
          variant="ghost"
          size="xs"
          onClick={() =>
            characterLens.setState((d) => {
              d.excludedFromRandomPick = !d.excludedFromRandomPick;
            })
          }
        >
          {characterLens.state.excludedFromRandomPick ? (
            <XCircle className="mr-2" />
          ) : (
            <CheckCircle2Icon className="mr-2" />
          )}
          {characterLens.state.excludedFromRandomPick
            ? "Include in random pick"
            : "Exclude from random pick"}
        </Button>
      </MenuEntry>
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
      {npcsLens.state.length > 0 && <CharacterCollection<CairnNpc>
        charType="npc"
        lens={npcsLens}
        HeaderMenu={NpcTools}
        Edit={NpcEdit}
        Details={NpcDetails}
      />}
    </div>
  );
}

interface GameItemHeaderProps {
  entryLens: ILens<GearContent>;
  categoryLens: ILens<GearContent[]>;
}

function GameItemHeader({ entryLens, categoryLens }: GameItemHeaderProps) {
  const log = useLoggerContext();
  const entry = entryLens.state;
  return (
    <CardHeader className="flex justify-between flex-row items-center gap-0 w-full">
      <TitleWithIcons name={entry.name}>
        <CardMenu>
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
          <MenuEntry>
            <Button
              variant="ghost"
              size="xs"
              onClick={() =>
                categoryLens.setState((d) => {
                  const entryToEdit = d.find((e) => e.id === entry.id)!;
                  entryToEdit.visibleToAll = !entryToEdit.visibleToAll;
                })
              }
            >
              {entry.visibleToAll ? (
                <EyeIcon className="mr-2" />
              ) : (
                <EyeOffIcon className="mr-2" />
              )}
              {entry.visibleToAll
                ? "Make invisible to players"
                : "Make visible to players"}
            </Button>
          </MenuEntry>
          <MenuEntry>
            <Button
              variant="ghost"
              size="xs"
              onClick={() =>
                categoryLens.setState((d) => {
                  const entryToEdit = d.find((e) => e.id === entry.id)!;
                  entryToEdit.excludedFromRandomPick =
                    !entryToEdit.excludedFromRandomPick;
                })
              }
            >
              {entry.excludedFromRandomPick ? (
                <XCircle className="mr-2" />
              ) : (
                <CheckCircle2Icon className="mr-2" />
              )}
              {entry.excludedFromRandomPick
                ? "Include in random pick"
                : "Exclude from random pick"}
            </Button>
          </MenuEntry>
          <MenuEntry>
            <DeleteAlert
              icon={
                <ButtonLike
                  variant="ghost"
                  size="xs"
                  className="flex gap-2 w-full"
                >
                  <Trash2Icon />
                  <div className="flex-grow text-left">Delete</div>
                </ButtonLike>
              }
              onConfirm={() =>
                categoryLens.setState((d) => d.filter((e) => e.id !== entry.id))
              }
            >
              This will permanently delete this entry
            </DeleteAlert>
          </MenuEntry>
        </CardMenu>
      </TitleWithIcons>
    </CardHeader>
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
      {itemsLens.state.length > 0 && <div className="flex flex-wrap w-full gap-2">
        {itemsLens.state.map((item, idx) => {
          const itemLens = getSubArrayLens(itemsLens, idx);
          return (
            <Card key={item.id} className="max-w-xs w-full">
              <GameItemHeader categoryLens={itemsLens} entryLens={itemLens} />
              <CardContent>
                <div>{item.description}</div>
                <WeakEmph>{item.privateNotes}</WeakEmph>
              </CardContent>
            </Card>
          );
        })}
      </div>}
    </div>
  );
}

