import {
  CurrentCharacterContextProvider,
  useCurrentGame,
} from "@/app/cairn/cairn-context";
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
import { initCharacter } from "@/lib/game/cairn/character-generation";
import { CairnCharacter } from "@/lib/game/cairn/types";
import { ILens } from "@/lib/types";
import {
  getSubArrayLens,
  getSubLens,
  getSubRecordLens,
  uuidv4,
} from "@/lib/utils";
import {
  EyeIcon,
  EyeOffIcon,
  FolderPlusIcon,
  PlusIcon,
  Trash2Icon,
  UserPlusIcon,
} from "lucide-react";
import { useState } from "react";

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
      <Accordion type="multiple" className="w-full">
        <AccordionItem value="npcs">
          <AccordionTrigger>NPCs</AccordionTrigger>
          <AccordionContent>
            <AllNpcs />
          </AccordionContent>
        </AccordionItem>
        {Object.keys(gameLens.state.customEntries).map((category) => (
          <AccordionItem value={category}>
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
                      <Card>
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

function AllNpcs() {
  const gameLens = useCurrentGame();
  const npcsLens = getSubLens(gameLens, "npcs");
  return (
    <div className="flex flex-col gap-2 items-start">
      <Button
        onClick={() =>
          npcsLens.setState((d) => {
            const newNpc: CairnCharacter = initCharacter();
            newNpc.strength = { current: 10, max: 10 };
            newNpc.dexterity = { current: 10, max: 10 };
            newNpc.willpower = { current: 10, max: 10 };
            newNpc.name = "new npc";
            d.push(newNpc);
          })
        }
      >
        <UserPlusIcon className="mr-2" /> New npc
      </Button>
      {npcsLens.state.map((npc, idx) => {
        const npcLens: ILens<CairnCharacter> = getSubArrayLens(npcsLens, idx);
        return (
          <CurrentCharacterContextProvider value={npcLens}>
            <Card>
              <CardHeader>
                <CharacterName>
                  <EditCharStats />
                  <CharacterInventoryDialog />
                  <DeleteAlert
                    icon={
                      <Button variant="ghost" size="icon-sm">
                        <Trash2Icon />
                      </Button>
                    }
                    onConfirm={() =>
                      npcsLens.setState((d) => d.filter((n) => n.id !== npc.id))
                    }
                  >
                    This will permanently delete this npc
                  </DeleteAlert>
                </CharacterName>
              </CardHeader>
              <CardContent>
                <CharacterStats />
              </CardContent>
            </Card>
          </CurrentCharacterContextProvider>
        );
      })}
    </div>
  );
}
