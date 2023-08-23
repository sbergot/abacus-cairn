import {
  useLoggerContext,
  CurrentCharacterContextProvider,
} from "@/app/cairn-context";
import { CairnCharacter } from "@/lib/game/cairn/types";
import { getDamages } from "@/lib/game/cairn/utils";
import { roll } from "@/lib/random";
import { ILens } from "@/lib/types";
import { getSubArrayLens } from "@/lib/utils";
import { UserPlusIcon, Trash2Icon } from "lucide-react";
import { ReactNode, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardHeader, CardContent } from "../ui/card";
import { DeleteAlert } from "../ui/delete-alert";
import { CharacterDescriptionDialog } from "./character-description";
import { CharacterInventoryDialog } from "./character-inventory-dialog";
import { CharacterName } from "./character-name";
import { CharacterStats } from "./character-stats";
import { EditCharStats } from "./edit-char-stats";
import { Draft } from "immer";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Checkbox } from "../ui/checkbox";
import {
  fillCharacterGear,
  initBasicCharacter,
  rollCharacterStats,
} from "@/lib/game/cairn/character-generation";

interface CharacterCollectionProps<TChar extends CairnCharacter> {
  charType: string;
  lens: ILens<TChar[]>;
  newChar(char: CairnCharacter): TChar;
  Tools({ characterLens }: { characterLens: ILens<TChar> }): ReactNode;
}

export function CharacterCollection<TChar extends CairnCharacter>({
  charType,
  lens,
  Tools,
  newChar,
}: CharacterCollectionProps<TChar>) {
  const log = useLoggerContext();
  return (
    <div className="flex flex-col gap-2 items-start">
      <NewCharacterDialog
        charType={charType}
        onCreate={(c) => {
          lens.setState((d) => {
            d.push(newChar(c) as Draft<TChar>);
          });
        }}
      />
      {lens.state.map((npc, idx) => {
        const charLens: ILens<TChar> = getSubArrayLens(lens, idx);
        return (
          <CurrentCharacterContextProvider key={npc.id} value={charLens}>
            <Card>
              <CardHeader>
                <CharacterName>
                  <EditCharStats />
                  <CharacterDescriptionDialog />
                  <CharacterInventoryDialog />
                  <DeleteAlert
                    icon={
                      <Button variant="ghost" size="icon-sm">
                        <Trash2Icon />
                      </Button>
                    }
                    onConfirm={() =>
                      lens.setState((d) => d.filter((n) => n.id !== npc.id))
                    }
                  >
                    This will permanently delete this {charType}
                  </DeleteAlert>
                  <Tools characterLens={charLens} />
                </CharacterName>
              </CardHeader>
              <CardContent>
                <CharacterStats />
                <div>
                  {charLens.state.inventory.map((s) =>
                    s.state.type === "gear" && s.state.gear.damage ? (
                      <Button
                        key={s.id}
                        onClick={() =>
                          log({
                            kind: "chat-custom",
                            type: "AttackRoll",
                            title: "Attack roll",
                            props: {
                              dice: getDamages(s),
                              result: roll(1, getDamages(s)),
                            },
                          })
                        }
                      >
                        {s.state.gear.name} (d{s.state.gear.damage})
                      </Button>
                    ) : null
                  )}
                </div>
              </CardContent>
            </Card>
          </CurrentCharacterContextProvider>
        );
      })}
    </div>
  );
}

interface NewCharacterDialogProps {
  charType: string;
  onCreate(char: CairnCharacter): void;
}

function NewCharacterDialog({ charType, onCreate }: NewCharacterDialogProps) {
  const [open, setOpen] = useState(false);
  const [randomizeStats, setRandomizeStats] = useState(false);
  const [randomizeGear, setRandomizeGear] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button><UserPlusIcon className="mr-2" /> New {charType}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New {charType}</DialogTitle>
        </DialogHeader>
        <div className="flex gap-2">
          <div className="h-7 flex items-center gap-2">
            <div>Randomize stats</div>
            <Checkbox
              defaultChecked={randomizeStats}
              onCheckedChange={() => setRandomizeStats((b) => !b)}
            />
          </div>
          <div className="h-7 flex items-center gap-2">
            <div>Randomize gears</div>
            <Checkbox
              defaultChecked={randomizeGear}
              onCheckedChange={() => setRandomizeGear((b) => !b)}
            />
          </div>
        </div>
        <Button
          onClick={() => {
            const result = initBasicCharacter();
            if (randomizeStats) {
              rollCharacterStats(result);
            }
            if (randomizeGear) {
              fillCharacterGear(result);
            }
            setOpen(false);
            onCreate(result);
          }}
        >
          Create
        </Button>
      </DialogContent>
    </Dialog>
  );
}
