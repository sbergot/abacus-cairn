import { useCurrentGame } from "@/app/cairn-context";
import { CharacterCollection } from "@/components/cairn/character-collection";
import { EditCustomEntryDialog } from "@/components/cairn/edit-custom-entry-dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DeleteAlert } from "@/components/ui/delete-alert";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import TextAreaField from "@/components/ui/textareafield";
import { WeakEmph } from "@/components/ui/typography";
import { CairnCharacter, CairnNpc } from "@/lib/game/cairn/types";
import { ILens } from "@/lib/types";
import {
  getSubArrayLens,
  getSubLens,
  getSubRecordLens,
  uuidv4,
} from "@/lib/utils";
import {
  CheckCircle2Icon,
  EyeIcon,
  EyeOffIcon,
  FolderPlusIcon,
  PlusIcon,
  Trash2Icon,
  XCircle,
} from "lucide-react";
import { useState } from "react";

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
        defaultValue={["npcs", ...Object.keys(gameLens.state.customEntries)]}
      >
        <AccordionItem value="npcs">
          <AccordionTrigger>NPCs</AccordionTrigger>
          <AccordionContent>
            <AllNpcs />
          </AccordionContent>
        </AccordionItem>
        {Object.keys(customEntriesLens.state).map((category) => {
          const categoryLens = getSubRecordLens(customEntriesLens, category);
          return (
            <AccordionItem key={category} value={category}>
              <AccordionTrigger>{category}</AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col items-start gap-2">
                  <div className="flex gap-2">
                    <NewEntryDialog
                      onCreate={(name, description) =>
                        gameLens.setState((d) => {
                          d.customEntries[category].push({
                            id: uuidv4(),
                            name,
                            description,
                            category,
                            excludedFromRandomPick: false,
                            visibleToAll: false,
                            privateNote: "",
                          });
                        })
                      }
                    />
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
                  <div className="grid grid-cols-2 gap-2 w-full">
                    {categoryLens.state.map((entry, idx) => {
                      const entryLens = getSubArrayLens(categoryLens, idx);
                      return (
                        <Card key={entry.id}>
                          <CardHeader className="flex justify-between flex-row items-center gap-0">
                            <CardTitle className="flex-grow">
                              {entry.name}
                            </CardTitle>
                            <EditCustomEntryDialog lens={entryLens} />
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              onClick={() =>
                                categoryLens.setState((d) => {
                                  const entryToEdit = d.find(
                                    (e) => e.id === entry.id
                                  )!;
                                  entryToEdit.visibleToAll =
                                    !entryToEdit.visibleToAll;
                                })
                              }
                            >
                              {entry.visibleToAll ? (
                                <EyeIcon />
                              ) : (
                                <EyeOffIcon />
                              )}
                            </Button>
                            <DeleteAlert
                              icon={
                                <Button variant="ghost" size="icon-sm">
                                  <Trash2Icon />
                                </Button>
                              }
                              onConfirm={() =>
                                categoryLens.setState((d) =>
                                  d.filter((e) => e.id !== entry.id)
                                )
                              }
                            >
                              This will permanently delete this entry
                            </DeleteAlert>
                          </CardHeader>
                          <CardContent>
                            <div>{entry.description}</div>
                            <WeakEmph>{entry.privateNote}</WeakEmph>
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

interface NewCategoryDialogProps {
  onCreate(name: string): void;
}

function NewCategoryDialog({ onCreate }: NewCategoryDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button>
          <FolderPlusIcon className="mr-2" /> New category
        </Button>
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

interface NewEntryDialogProps {
  onCreate(name: string, description: string): void;
}

function NewEntryDialog({ onCreate }: NewEntryDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button>
          <PlusIcon size={20} />
          New entry
        </Button>
      </DialogTrigger>
      <DialogContent>
        <div>Name</div>
        <Input value={name} onChange={(e) => setName(e.target.value)} />
        <div>Description</div>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Button
          onClick={() => {
            onCreate(name, description);
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
  return (
    <>
      <Button
        size="icon-sm"
        variant="ghost"
        onClick={() =>
          characterLens.setState((d) => {
            d.visibleToAll = !d.visibleToAll;
          })
        }
      >
        {characterLens.state.visibleToAll ? <EyeIcon /> : <EyeOffIcon />}
      </Button>
      <Button
        size="icon-sm"
        variant="ghost"
        onClick={() =>
          characterLens.setState((d) => {
            d.excludedFromRandomPick = !d.excludedFromRandomPick;
          })
        }
      >
        {characterLens.state.excludedFromRandomPick ? (
          <XCircle />
        ) : (
          <CheckCircle2Icon />
        )}
      </Button>
    </>
  );
}

function NpcEdit({ characterLens }: { characterLens: ILens<CairnNpc> }) {
  return (
    <div>
      <div>Private notes</div>
      <TextAreaField lens={characterLens} fieldName="privateNote" />
    </div>
  );
}

function NpcDetails({ characterLens }: { characterLens: ILens<CairnNpc> }) {
  return (
    <WeakEmph>
      {characterLens.state.privateNote}
    </WeakEmph>
  );
}

function newNpc(char: CairnCharacter): CairnNpc {
  const newNpc: CairnNpc = {
    ...char,
    visibleToAll: false,
    excludedFromRandomPick: false,
    privateNote: "",
  };
  return newNpc;
}

function AllNpcs() {
  const gameLens = useCurrentGame();
  const npcsLens = getSubLens(gameLens, "npcs");
  return (
    <CharacterCollection<CairnNpc>
      charType="npc"
      lens={npcsLens}
      newChar={newNpc}
      HeaderMenu={NpcTools}
      Edit={NpcEdit}
      Details={NpcDetails}
    />
  );
}
