import { Timer } from "@/lib/game/types";
import { useLens } from "@/lib/hooks";
import { uuidv4 } from "@/lib/utils";
import TextField from "./textfield";
import { Dialog, DialogContent, DialogFooter, DialogTrigger } from "./dialog";
import { Button } from "./button";
import { AlarmPlusIcon } from "lucide-react";
import CheckboxField from "./checkboxfield";
import NumberField from "./numberfield";
import { useState } from "react";

function initTimer(): Timer {
  return {
    currentTimeInMSec: 0,
    id: uuidv4(),
    intervalInSec: 60,
    isPaused: true,
    isPublic: false,
    isRecurring: false,
    name: "",
    description: "",
    visibleToAll: false,
    excludedFromRandomPick: false,
    privateNotes: ""
  };
}

interface Props {
  onCreate(timer: Timer): void;
}

export function TimerEditDialog({ onCreate }: Props) {
  const timerLens = useLens<Timer>(initTimer());
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button asChild>
          <div>
            <AlarmPlusIcon /> New timer
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <div className="flex items-end gap-4">
          <div>
            <div className="mb-2">Title</div>
            <TextField lens={timerLens} fieldName="name" />
          </div>
          <div className="flex gap-2 mb-1 items-center">
            <CheckboxField
              className="w-8 h-8"
              lens={timerLens}
              fieldName="isPublic"
            />
            <div>Public</div>
          </div>
          <div className="flex gap-2 mb-1 items-center">
            <CheckboxField
              className="w-8 h-8"
              lens={timerLens}
              fieldName="isRecurring"
            />
            <div>Recurring</div>
          </div>
        </div>
        <div className="flex">
          <div>
            <div>Interval</div>
            <NumberField lens={timerLens} fieldName="intervalInSec" />
          </div>
        </div>
        <DialogFooter>
          <Button
            disabled={!timerLens.state.name}
            onClick={() => {
              onCreate(timerLens.state);
              timerLens.setState(() => initTimer());
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
