import { initBasicCharacter, rollCharacterStats, fillCharacterGear } from "@/lib/game/cairn/character-generation";
import { CairnCharacter } from "@/lib/game/cairn/types";
import { UserPlusIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Checkbox } from "../ui/checkbox";
import { ButtonLike } from "../ui/button-like";

interface NewCharacterDialogProps {
  charType: string;
  onCreate(char: CairnCharacter): void;
}

export function NewCharacterDialog({ charType, onCreate }: NewCharacterDialogProps) {
  const [open, setOpen] = useState(false);
  const [randomizeStats, setRandomizeStats] = useState(false);
  const [randomizeGear, setRandomizeGear] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <ButtonLike>
          <UserPlusIcon className="mr-2" /> New {charType}
        </ButtonLike>
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
