import {
  CurrentCharacterContextProvider,
  useCurrentGame,
  useLoggerContext,
} from "@/app/cairn-context";
import { CharacterCollection } from "@/components/cairn/character-collection";
import { CharacterDescriptionDialog } from "@/components/cairn/character-description";
import { CharacterInventoryDialog } from "@/components/cairn/character-inventory-dialog";
import { CharacterName } from "@/components/cairn/character-name";
import { CharacterStats } from "@/components/cairn/character-stats";
import { EditCharStats } from "@/components/cairn/edit-char-stats";
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
import {
  getRandomName,
  initCharacter,
  initCharacterBase,
} from "@/lib/game/cairn/character-generation";
import { CairnCharacter, CairnNpc } from "@/lib/game/cairn/types";
import { getDamages } from "@/lib/game/cairn/utils";
import { roll } from "@/lib/random";
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
  UserPlusIcon,
  XCircle,
} from "lucide-react";
import { ReactNode, useState } from "react";

export function AllContent() {
  const gameLens = useCurrentGame();
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
        {Object.keys(gameLens.state.customEntries).map((category) => (
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
                    This will permanently delete this category and all its items
                  </DeleteAlert>
                </div>
                <div className="grid grid-cols-2 gap-2 w-full">
                  {gameLens.state.customEntries[category].map((entry) => {
                    const customEntriesLens = getSubLens(
                      gameLens,
                      "customEntries"
                    );
                    const categoryLens = getSubRecordLens(
                      customEntriesLens,
                      category
                    );
                    return (
                      <Card key={entry.id}>
                        <CardHeader className="flex justify-between flex-row items-center gap-2">
                          <CardTitle className="flex-grow">
                            {entry.name}
                          </CardTitle>
                          <Button
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
                            {entry.visibleToAll ? <EyeIcon /> : <EyeOffIcon />}
                          </Button>
                          <DeleteAlert
                            icon={
                              <Button size="icon-sm">
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
                        <CardContent>{entry.description}</CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
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

function newNpc(): CairnNpc {
  const newNpc: CairnNpc = {
    ...initCharacter(),
    visibleToAll: false,
    excludedFromRandomPick: false,
  };
  newNpc.strength = { current: 10, max: 10 };
  newNpc.dexterity = { current: 10, max: 10 };
  newNpc.willpower = { current: 10, max: 10 };
  newNpc.name = getRandomName();
  return newNpc;
}

function AllNpcs() {
  const gameLens = useCurrentGame();
  const npcsLens = getSubLens(gameLens, "npcs");
  return (
    <CharacterCollection<CairnNpc>
      lens={npcsLens}
      newChar={newNpc}
      Tools={NpcTools}
    />
  );
}
