import { useCurrentGame, useLoggerContext } from "@/app/cairn-context";
import { CharacterCollection } from "@/components/cairn/character-collection";
import { EditCustomEntryDialog } from "@/components/cairn/edit-custom-entry-dialog";
import { NewCharacterDialog } from "@/components/cairn/new-character-dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DeleteAlert } from "@/components/ui/delete-alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import TextAreaField from "@/components/ui/textareafield";
import { TooltipShort } from "@/components/ui/tooltip-short";
import { WeakEmph } from "@/components/ui/typography";
import { CairnCharacter, CairnNpc } from "@/lib/game/cairn/types";
import { CustomEntry, GmContent } from "@/lib/game/types";
import { pickRandom } from "@/lib/random";
import { ILens } from "@/lib/types";
import {
  getSubArrayLens,
  getSubLens,
  getSubRecordLens,
  uuidv4,
} from "@/lib/utils";
import { Draft } from "immer";
import {
  CheckCircle2Icon,
  DicesIcon,
  EyeIcon,
  EyeOffIcon,
  FolderPlusIcon,
  PlusIcon,
  Share2Icon,
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
                      onCreate={(name, description, privateNotes) =>
                        gameLens.setState((d) => {
                          d.customEntries[category].push({
                            id: uuidv4(),
                            name,
                            description,
                            category,
                            excludedFromRandomPick: false,
                            visibleToAll: false,
                            privateNotes: privateNotes,
                          });
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
                  <div className="grid grid-cols-2 gap-2 w-full">
                    {categoryLens.state.map((entry, idx) => {
                      const entryLens = getSubArrayLens(categoryLens, idx);
                      return (
                        <Card key={entry.id}>
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
      <TooltipShort name={`Edit ${category}`}>
        <EditCustomEntryDialog lens={entryLens} />
      </TooltipShort>
      <TooltipShort
        name={
          entry.visibleToAll
            ? "Make invisible to players"
            : "Make visible to players"
        }
      >
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
      </TooltipShort>
      <TooltipShort
        name={
          entry.excludedFromRandomPick
            ? "Include in random pick"
            : "Exclude from random pick"
        }
      >
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
      </TooltipShort>
      <TooltipShort name="Delete">
        <DeleteAlert
          icon={
            <Button variant="ghost" size="icon-sm">
              <Trash2Icon />
            </Button>
          }
          onConfirm={() =>
            categoryLens.setState((d) => d.filter((e) => e.id !== entry.id))
          }
        >
          This will permanently delete this entry
        </DeleteAlert>
      </TooltipShort>
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
  onCreate(name: string, description: string, privateNotes: string): void;
}

function NewEntryDialog({ onCreate }: NewEntryDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [privateNotes, setPrivateNotes] = useState("");
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
        <div>Private notes</div>
        <Textarea
          value={privateNotes}
          onChange={(e) => setPrivateNotes(e.target.value)}
        />
        <Button
          onClick={() => {
            onCreate(name, description, privateNotes);
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
      <TooltipShort
        name={
          characterLens.state.visibleToAll
            ? "Make invisible to players"
            : "Make visible to players"
        }
      >
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
      </TooltipShort>
      <TooltipShort
        name={
          characterLens.state.excludedFromRandomPick
            ? "Include in random pick"
            : "Exclude from random pick"
        }
      >
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
      </TooltipShort>
      <TooltipShort name="share">
        <Button
          size="icon-sm"
          variant="ghost"
          onClick={() =>
            log({
              kind: "chat-custom",
              type: "NpcShare",
              props: { npc: characterLens.state },
            })
          }
        >
          <Share2Icon />
        </Button>
      </TooltipShort>
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
      <CharacterCollection<CairnNpc>
        charType="npc"
        lens={npcsLens}
        HeaderMenu={NpcTools}
        Edit={NpcEdit}
        Details={NpcDetails}
      />
    </div>
  );
}

interface RandomEntryDialogProps {
  lens: ILens<GmContent[]>;
  name: string;
}

function RandomEntryDialog({ lens, name }: RandomEntryDialogProps) {
  const [entry, setEntry] = useState<GmContent | undefined>(undefined);
  return (
    <Dialog
      onOpenChange={(open) =>
        open &&
        setEntry(
          pickRandom(lens.state.filter((e) => !e.excludedFromRandomPick))
        )
      }
    >
      <DialogTrigger>
        <Button>
          <DicesIcon /> Pick random {name}
        </Button>
      </DialogTrigger>
      <DialogContent>
        {entry === undefined ? (
          "no pickable entry"
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>{entry.name}</DialogTitle>
            </DialogHeader>
            {entry.description}
            <WeakEmph>{entry.privateNotes}</WeakEmph>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
