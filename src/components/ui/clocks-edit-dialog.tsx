import { Clock } from "@/lib/game/types";
import { useLens } from "@/lib/hooks";
import { uuidv4 } from "@/lib/utils";
import TextField from "./textfield";
import { Dialog, DialogContent, DialogFooter, DialogTrigger } from "./dialog";
import { Button } from "./button";
import { AlarmPlusIcon } from "lucide-react";
import NumberField from "./numberfield";
import { useState } from "react";

function initClock(): Clock {
  return {
    id: uuidv4(),
    name: "",
    description: "",
    excludedFromRandomPick: false,
    privateNotes: "",
    visibleToAll: false,
    gauge: { current: 0, max: 0 },
  };
}

interface Props {
  onCreate(timer: Clock): void;
}

export function ClockEditDialog({ onCreate }: Props) {
  const clockLens = useLens<Clock>(initClock());
  const sizeLens = useLens<{ value: number }>({ value: 1 });

  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button asChild>
          <div>
            <AlarmPlusIcon /> New clock
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <div className="flex items-end gap-4">
          <div>
            <div className="mb-2">Title</div>
            <TextField lens={clockLens} fieldName="name" />
          </div>
          <div>
            <div className="mb-2">Size</div>
            <NumberField lens={sizeLens} fieldName="value" />
          </div>
        </div>
        <DialogFooter>
          <Button
            disabled={!clockLens.state.name}
            onClick={() => {
              onCreate({
                ...clockLens.state,
                gauge: {
                  current: 0,
                  max: sizeLens.state.value,
                },
              });
              clockLens.setState(() => initClock());
              sizeLens.setState(() => ({ value: 1 }));
              setOpen(false);
            }}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
